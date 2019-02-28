const express = require('express')

const app = express()
let port: Number

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

export function setPort(portNumber: Number) {
    port = portNumber
}

export function setDefaultRoute(request: String, filename: String) {
    console.log(filename)
    app.get(request, (req, res) => res.sendFile(filename))
}

export function setClientFolder(folderName: String) {
    app.use(folderName, express.static(folderName))
}
