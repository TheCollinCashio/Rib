import * as io from 'socket.io-client'

export default class RibClient {
    private socket: SocketIOClient.Socket
    private functionMap = new Map<string, Function>()

    constructor(urlNamespace: string) {
        this.socket = urlNamespace ? io(urlNamespace) : io('/')
    }

    onConnect(cb: Function) {
        this.socket.on('RibSendKeysToClient', (keys: string[]) => {
            this.setUpFunctions(keys)
            this.setUpSocketFunctions()
            let clientKeys = [...this.functionMap.keys()]
            this.socket.emit('RibSendKeysToServer', clientKeys)
            cb()
        })
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

    private setUpSocketFunctions() {
        this.functionMap.forEach((fn, event) => {
            this.socket.on(event, (...args) => {
                fn(...args)
            })
        })
    }

    private setUpFunctions(keys: string[]) {
        for (let key of keys) {
            this[key] = (data? :any, func?: (value?: any) => void) => {
                this.socket.emit(key, data, (res: any) => {
                    func(res)
                })
            }
        }
    }
}