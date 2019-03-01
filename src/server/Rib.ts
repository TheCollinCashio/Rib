import * as express from 'express'
import * as socket from 'socket.io'
import * as redisAdapter from 'socket.io-redis'
import { Server } from 'http'

//  Setup Socket Application
let app = express()
let server = new Server(app)

export default class Rib {
    private io = socket(server, { pingInterval: 3000, pingTimeout: 7500 })
    private routes = new Map<string, ((value?: any) => void)>()
    private socketList = new Map<string, SocketIO.EngineSocket>()

    constructor(port: number, startMessage: string) {
        server.listen(port, () => console.log(startMessage))

        this.io.on('connection', (socket: SocketIO.EngineSocket) => {
            this.setUpSocketList(socket)
            this.setSocketRoutes(socket)
        })
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

    exposeFunction(func: (value?: any) => void) {
        let funcName = func.name

        if (this.routes.get(funcName)) {
            throw new Error(`${funcName} already exists. The function names need to be unique`)
        } else {
            this.routes.set(funcName, func)
        }
    }

    exposeFunctions(funcs: ((value?: any) => void)[]) {
        for (let func of funcs) {
            this.exposeFunction(func)
        }
    }

    concealFunction(func: (value?: any) => void) {
        let funcName = func.name
        this.routes.delete(funcName)
    }

    concealFunctions(funcs: ((value?: any) => void)[]) {
        for (let func of funcs) {
            this.concealFunction(func)
        }
    }

    setUpSocketList(socket: SocketIO.EngineSocket) {
        this.socketList.set(socket.id, socket)
        socket.on('disconnect', () => { this.socketList.delete(socket.id) })
    }

    setSocketRoutes(socket: SocketIO.EngineSocket) {
        this.routes.forEach((fn, event) => {
            socket.on(event, fn)
        })
    }
}