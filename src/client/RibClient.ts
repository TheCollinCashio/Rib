import * as io from 'socket.io-client'

export default class RibClient {
    private socket: SocketIOClient.Socket
    constructor(urlNamespace: string) {
        this.socket = urlNamespace ? io(urlNamespace) : io()
    }

    onConnect(cb) {
        this.socket.on('RibSendKeysToClient', (keys: string[]) => {
            this.setUpFunctions(keys)
            cb()
        })
    }

    private setUpFunctions(keys: string[]) {
        for (let key of keys) {
            this[key] = (data? :any, func?: (value?: any) => void) => {
                this.socket.emit(key, data, (res) => {
                    func(res)
                })
            }
        }
    }
}