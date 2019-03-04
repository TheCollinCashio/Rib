import * as express from 'express'
import * as socket from 'socket.io'
import * as redisAdapter from 'socket.io-redis'
import { Server } from 'http'

//  Setup Socket Application
let app = express()
let server = new Server(app)
let io = socket(server, { pingInterval: 3000, pingTimeout: 7500 })

export default class Rib {
    private recievedKeysFromClient = false
    private connFunc: Function
    private nameSpace: SocketIO.Namespace
    private functionMap = new Map<string, Function>()
    private socketList = new Map<string, SocketIORib.EngineSocket>()

    constructor(nameSpace?: string) {
        this.nameSpace = this.nameSpace ? io.of(nameSpace) : io.of('/')
        this.nameSpace.on('connection', (socket: SocketIORib.EngineSocket) => {
            this.connFunc = this.connFunc ? this.connFunc : () => {} // keep app from breaking if user does not input a connFunc
            socket._ribRecievedKeysFromClient = false   //  socket client obj has not yet recieved keys
            this.setUpPersistentObject(socket)
            this.setUpSocketList(socket)
            this.setSocketFunctions(socket)
            this.sendKeysToClient(socket)
            this.setUpKeysFromClient(socket)
        })
    }

    onConnect(callback: Function) {
        this.connFunc = callback
    }

    static startServer(port: number, startMessage: string) {
        server.listen(port, () => console.log(startMessage))
    }

    static setRedisUrl(url: string) {
        io.adapter(redisAdapter(url))
    }

    setDefaultRoute(request: string, fileName: string) {
        app.get(request, (req, res) => res.sendFile(fileName))
    }

    setClientFolder(folderNames: string[]) {
        for (let folder of folderNames) {
            app.use(express.static(folder))
        }
    }

    exposeFunction(func: Function) {
        let funcName = func.name

        if (this.functionMap.get(funcName)) {
            throw new Error(`${funcName} already exists. The function names need to be unique`)
        } else {
            this.functionMap.set(funcName, func)
        }
    }

    exposeFunctions(funcs: Function[]) {
        for (let func of funcs) {
            this.exposeFunction(func)
        }
    }

    concealFunction(func: Function) {
        let funcName = func.name
        this.functionMap.delete(funcName)
    }

    concealFunctions(funcs: Function[]) {
        for (let func of funcs) {
            this.concealFunction(func)
        }
    }

    setUpSocketList(socket: SocketIORib.EngineSocket) {
        this.socketList.set(socket.id, socket)
        socket.on('disconnect', () => { this.socketList.delete(socket.id) })
    }

    setSocketFunctions(socket: SocketIORib.EngineSocket) {
        this.functionMap.forEach((fn, event) => {
            socket.on(event, (...args) => {
                fn(...args, this.getPersistentObject(socket))
            })
        })
    }

    private sendKeysToClient(socket: SocketIORib.EngineSocket) {
        let keys = [...this.functionMap.keys()]
        socket.emit('RibSendKeysToClient', keys)
    }

    private setUpPersistentObject(socket: SocketIORib.EngineSocket) {
        Object.assign(socket, { _ribClient: { _ribSocket: socket } })
    }

    private getPersistentObject(socket: SocketIORib.EngineSocket) {
        return socket._ribClient
    }

    private setUpKeysFromClient(socket: SocketIORib.EngineSocket) {
        socket.on('RibSendKeysToServer', (keys: string[]) => {
            if (!socket._ribRecievedKeysFromClient) {
                this.recievedKeysFromClientForSocket(socket, keys)
            }

            if (!this.recievedKeysFromClient) {
                this.recieveKeysFromClient(keys)
                this.connFunc()
            }
        })
    }

    private recievedKeysFromClientForSocket(socket: SocketIORib.EngineSocket, keys: string[]) {
        let ribClient = this.getPersistentObject(socket)
        for (let key of keys) {
            ribClient[key] = (data?: any, func?: (value?: any) => void) => {
                socket.emit(key, data, (...args) => {
                    func(...args, this.getPersistentObject(socket))
                })
            }
        }
        socket._ribRecievedKeysFromClient = true
    }

    private recieveKeysFromClient(keys: string[]) {
        for (let key of keys) {
            this[key] = (data?: any, func?: (value?: any) => void) => {
                this.nameSpace.emit(key, data)
            }
        }
        this.recievedKeysFromClient = true
    }
}

export namespace SocketIORib {
    export interface EngineSocket extends SocketIO.EngineSocket {
        _ribClient : any
        _ribRecievedKeysFromClient : boolean
    }
}