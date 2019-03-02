import * as express from 'express'
import * as socket from 'socket.io'
import * as redisAdapter from 'socket.io-redis'
import { Server } from 'http'

//  Setup Socket Application
let app = express()
let server = new Server(app)

export default class Rib {
    private recievedKeysFromClient = false
    private connFunc: Function
    private io = socket(server, { pingInterval: 3000, pingTimeout: 7500 })
    private functionMap = new Map<string, Function>()
    private socketList = new Map<string, SocketIO.EngineSocket>()

    constructor() {
        this.io.on('connection', (socket: SocketIO.EngineSocket) => {
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

    setRedisUrl(url: string) {
        this.io.adapter(redisAdapter(url))
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

    setUpSocketList(socket: SocketIO.EngineSocket) {
        this.socketList.set(socket.id, socket)
        socket.on('disconnect', () => { this.socketList.delete(socket.id) })
    }

    setSocketFunctions(socket: SocketIO.EngineSocket) {
        this.functionMap.forEach((fn, event) => {
            socket.on(event, (...args) => {
                fn(...args, socket)
            })
        })
    }

    private sendKeysToClient(socket: SocketIO.EngineSocket) {
        let keys = [...this.functionMap.keys()]
        socket.emit('RibSendKeysToClient', keys)
    }

    private setUpKeysFromClient(socket: SocketIO.EngineSocket) {
        socket.on('RibSendKeysToServer', (keys: string[]) => {
            if (!this.recievedKeysFromClient) {
                this.recieveKeysFromClient(keys)
                this.connFunc()
            }
        })
    }

    private recieveKeysFromClient(keys: string[]) {
        for (let key of keys) {
            this[key] = (data?: any, func?: (value?: any) => void) => {
                this.io.emit(key, data)
            }
        }
        this.recievedKeysFromClient = true
    }
}