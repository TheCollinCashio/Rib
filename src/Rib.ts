import express from 'express'

const app = express()
let port: Number

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

export function setPort(portNumber: Number) {
    port = portNumber
}

export function createDefaultRoute(request: String, filename: String) {
    app.get(request, (req, res) => res.sendFile(__dirname + '/' + filename))
}

export function serveClientFolder(folderName: String) {
    app.use(folderName, express.static(__dirname + '/' + folderName))
}
