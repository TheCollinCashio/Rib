let RibServer = require("../Rib-Server/lib/RibServer").default
const PORT = 6000
RibServer.startServer(PORT)
RibServer.setRedisUrl('//localhost:6379')

let myRib = new RibServer()
myRib.onConnect(async (client) => {
    client.setName = (name, other) => {
        client.name = name
    }

    client.getName = () => {
        return client.name
    }
})

function postMessage(message, client) {
    myRib.postMessage(message, { query: { _ribId: { $ne: client._ribId } }});
}

function setName(querName, name) {
    myRib.runPOF('setName', name, { query: { name: querName }})
}

async function getNames() {
    let names = await myRib.runPOF('getName')
    return names
}

async function add(x, y) {
    return x + y;
}

async function logMessage(message) {
    console.log(message);
}

myRib.onDisconnect((client) => {
    console.log("A client disconnected 🙁")
})

myRib.exposeFunctions([postMessage, setName, getNames, logMessage, add])