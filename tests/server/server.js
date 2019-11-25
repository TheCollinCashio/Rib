let RibServer = require("../../Rib-Server/lib/RibServer").default
const PORT = process.argv[2] || 5000;
RibServer.startServer(PORT)
RibServer.setRedisUrl('//localhost:6379')

let myRib = new RibServer()
myRib.onConnect(async (client) => {
    client.getName = () => {
        return client.name
    }
})

function postMessage(message, client) {
    myRib.postMessage(message, { query: { _ribId: { $ne: client._ribId } }});
}

function setName(name, client) {
    client.name = name;
}

async function getNames() {
    let names = await myRib.runPOF('getName');
    return names;
}

function getName(client) {
    return client.name;
}

async function add(x, y) {
    return x + y;
}

myRib.onDisconnect((client) => {
    console.log("A client disconnected 🙁");
})

myRib.exposeFunctions([postMessage, setName, getNames, getName, add])