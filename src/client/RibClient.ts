import * as io from 'socket.io-client'

export default class RibClient {
    private socket: SocketIOClient.Socket
    constructor(urlNamespace: string) {
        this.socket = urlNamespace ? io(urlNamespace) : io()
    }

    connected() {
        return new Promise((resolve, reject) => {
            this.socket.on('connect', () => {
                resolve()
            })
        })
    }

    call(func: (value?: any) => void) {
        this.socket.emit(func.name, (res) => {
            func(res)
        })
    }
}