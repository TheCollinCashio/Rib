const express = require('express')

const app = express()
let port: Number

export function setPort(portNumber: Number) {
    port = portNumber
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export function setDefaultRoute(request: String, filename: String) {
    app.get(request, (req, res) => res.sendFile(filename))
}

export function setClientFolder(folderName: String) {
    app.use(express.static(folderName))
}
