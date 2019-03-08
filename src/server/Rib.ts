import * as express from 'express'
import * as socket from 'socket.io'
import * as redisAdapter from 'socket.io-redis'
import { Server } from 'http'

//  Setup Socket Application
let app = express()
let server = new Server(app)
let io = socket(server, { pingInterval: 3000, pingTimeout: 7500 })

export default class Rib {
    private connFunc: Function
    private nameSpace: SocketIO.Namespace
    private serverFunctionMap = new Map<string, Function>()
    private clientFunctionMap = new Map<string, Function>()
    private socketList = new Map<string, SocketIORib.EngineSocket>()

    constructor(nameSpace?: string) {
        this.nameSpace = this.nameSpace ? io.of(nameSpace) : io.of('/')
        this.nameSpace.on('connection', (socket: SocketIORib.EngineSocket) => {
            this.connFunc = this.connFunc ? this.connFunc : () => {} // keep app from breaking if user does not input a connFunc
            this.setUpPersistentObject(socket)
            this.setUpSocketList(socket)
            this.setSocketFunctions(socket)
            this.sendKeysToClient(socket)
            this.setUpKeysFromClient(socket)
        })
    }

    /**
        * The safest way to call functions
        * @param funcName
    **/
    call(funcName, ...args) {
        let f = this.clientFunctionMap.get(funcName)
        if (f) {
            f(...args)
        } else {
            console.error(`${f} is not an exposed function name`)
        }
    }

    /**
        * Sets all possible client functions
        * @param funcNames
    **/
    possibleClientFunctions(funcNames: string[]) {
        for (let funcName of funcNames) {
            this.serverFunctionMap.set(funcName, () => {
                console.log(`${funcName} has not been bound properly to server`)
            })
        }
    }

    /**
        * Called after a rib client connects to the server
        * @callback clientObject
    **/
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

        if (this.serverFunctionMap.get(funcName)) {
            throw new Error(`${funcName} already exists. The function names need to be unique`)
        } else {
            this.serverFunctionMap.set(funcName, func)
        }
    }

    exposeFunctions(funcs: Function[]) {
        for (let func of funcs) {
            this.exposeFunction(func)
        }
    }

    concealFunction(func: Function) {
        let funcName = func.name
        this.serverFunctionMap.delete(funcName)
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
        this.serverFunctionMap.forEach((fn, event) => {
            socket.on(event, (...args) => {
                fn(...args, this.getPersistentObject(socket))
            })
        })
    }

    private sendKeysToClient(socket: SocketIORib.EngineSocket) {
        let keys = [...this.serverFunctionMap.keys()]
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
            this.setClientFunctionMap(keys)
            this.recievedKeysFromClientForSocket(keys)
            this.recieveKeysFromClient(keys)
            this.connFunc(this.getPersistentObject(socket))
        })
    }

    private setClientFunctionMap(keys: string[]) {
        for (let key of keys) {
            this.serverFunctionMap.set(key, (...args) => {
                if (args.length > 0) {
                    let finalArgument = args[args.length - 1]
                    if (finalArgument) {
                        if (finalArgument.exclude) {
                            let excludeSocket = finalArgument.exclude._ribSocket
                            delete args[args.length - 1]
                            excludeSocket.broadcast.emit(key, ...args)
                        }
                    }
                } else {
                    this.nameSpace.emit(key, ...args)
                }
            })
        }
    }

    private recievedKeysFromClientForSocket(keys: string[]) {
        let socketKeys = [...this.socketList.keys()]
        for (let socketId of socketKeys) {
            let socket = this.socketList.get(socketId)
            let ribClient = this.getPersistentObject(socket)
            for (let key of keys) {
                ribClient[key] = (...args) => {
                    socket.emit(key, ...args)
                }
            }
        }
    }

    private recieveKeysFromClient(keys: string[]) {
        for (let key of keys) {
            this[key] = (...args) => {
                if (args.length > 0) {
                    let finalArgument = args[args.length - 1]
                    if (finalArgument) {
                        if (finalArgument.exclude) {
                            let excludeSocket = finalArgument.exclude._ribSocket
                            delete args[args.length - 1]
                            excludeSocket.broadcast.emit(key, ...args)
                        }
                    }
                } else {
                    this.nameSpace.emit(key, ...args)
                }
            }
        }
    }
}

export namespace SocketIORib {
    export interface EngineSocket extends SocketIO.EngineSocket {
        _ribClient: any
    }
}