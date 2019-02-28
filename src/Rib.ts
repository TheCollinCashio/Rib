import express from 'express'

const app = express()
const port = 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

export function createDefaultRoute(request, filename) {
    app.get(request, (req, res) => res.sendFile(__dirname + '/' + filename))
}

export function serveClientFolder(folderName) {
    app.use('/client', express.static(__dirname + '/client'))
}

