const express = require('express')
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

io.on('connection', function(socket) {
    console.log('a user connected')
})

let port: Number

export function setPort(portNumber: Number) {
    port = portNumber
    http.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export function setDefaultRoute(request: String, fileName: String) {
    app.get(request, (req, res) => res.sendFile(fileName))
}

export function setClientFolder(folderName: String) {
    app.use(express.static(folderName))
}

export function createRoute(routeName: String) {}

export function createRoutewithResult() {}
