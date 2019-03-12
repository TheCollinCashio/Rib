import * as io from 'socket.io-client'
let instance = null

export class RibClient {
    private socket: SocketIOClient.Socket
    private functionMap = new Map<string, Function>()

    constructor(urlNamespace?: string, isSingleton = true) {
        let returnInstance = this

        if (isSingleton && instance) {
            returnInstance = instance
        } else {
            this.socket = urlNamespace ? io(urlNamespace) : io('/')
        }

        if (isSingleton && !instance) {
            instance = this
        }
        
        return returnInstance
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
            this[key] = (...args) => {
                this.socket.emit(key, ...args)
            }
        }
    }
}

export class ClientStore {
    private data = new Map<string, any>()
    private functionMap = new Map<string, ((value?: any) => void)[]>()

    constructor(obj: object) {
        this.set(obj)
    }

    set(obj: object, addFunc?: (value?: any) => void) {
        let returnFunc = null

        for (let key in obj) {
            this.data.set(key, obj[key])

            let functions = this.functionMap.get(key)
            
            if (functions) {
                functions.forEach(fn => fn({ [key]: obj[key]} ))
            }

            if (addFunc) {
                if (functions) {
                    this.functionMap.set(key, [...functions, addFunc])
                } else {
                    this.functionMap.set(key, [addFunc])
                }

                returnFunc = () => {
                    this.unBind(key, addFunc)
                }
            }
        }

        return returnFunc
    }

    get(key: string) {
        return this.data.get(key)
    }

    delete(key: string) {
        this.data.delete(key)

        const funcions = this.functionMap.get(key)

        if (funcions) {
            funcions.forEach(fn => fn())
        }
    }

    bindToFunction(key: string, fn: (value?: any) => void) {
        const funcions = this.functionMap.get(key)

        if (funcions) {
            this.functionMap.set(key, [...funcions, fn])
        } else {
            this.functionMap.set(key, [fn])
        }

        let unBind = () => {
            this.unBind(key, fn)
        }

        return unBind
    }

    private unBind(key: string, fnToUnbind: (value?: any) => void) {
        const functions = this.functionMap.get(key)
        this.functionMap.set(key, functions.filter(fn => fn !== fnToUnbind))
    }
}