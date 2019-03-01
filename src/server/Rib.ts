import * as express from 'express'
import * as socket from 'socket.io'
import { Server } from 'http'

//  Setup Socket Application
let app = express()
let server = new Server(app)
let io = socket(server, {
    pingInterval: 3000, pingTimeout: 7500
})

io.on('connection', function(socket) {
    console.log('a user connected')
})

let port: Number

export function setPort(portNumber: Number) {
    port = portNumber
    server.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export function setDefaultRoute(request: string, fileName: string) {
    app.get(request, (req, res) => res.sendFile(fileName))
}

export function setClientFolder(folderName: string) {
    app.use(express.static(folderName))
}

export function createRoute(routeName: String) {}

export function createRoutewithResult() {}