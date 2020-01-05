import RibServer from 'rib-server'
import { ServerStore } from 'rib-store'
RibServer.startServer(5000, 'This is much easier to program')
RibServer.setRoute('/', `${__dirname}/client/index.html`)
RibServer.setClientFolder(`${__dirname}/client/build`)

let myRib = new RibServer()

/*  Server Store */
let myServerStore = new ServerStore({
    messages: []
})

myServerStore.exposeStore('messageStore', myRib, true)

//  Safely expose functions
myRib.possibleClientFunctions(['sendMSG', 'bindLog'])

myRib.onConnect((client) => {
    myRib.concealFunction(setName, client)
    myRib.sendMSG('Welcome to this example app.', { query: client })
    myRib.sendMSG('WE HAVE A NEW PLAYER IN TOWN...', { query: { _ribId: { $ne: client._ribId } }})
})

function setName(name, client) {
    client.name = name
    myRib.sendMSG(`Welcome, ${name}`, { query: client })
    myRib.sendMSG(`Their name is ${name}...`, { query: { _ribId: { $ne: client._ribId } }})
    return 'Name Set On Server'
}

function getMessages(func, client) {
    if(client.name) {
        func(messages)
    }
}

function sendMSG(message, client) {
    let didSendMessage = false
    if (client.name) {
        myRib.concealFunction(setName, client)

        let msgObj = {
            name: client.name,
            message: message
        }

        let storeObj = myServerStore.get({ messages: [] })
        let messages = [...storeObj.messages, msgObj]
        myServerStore.set({ messages })
        didSendMessage = true
    }

    return didSendMessage
}

myRib.exposeFunctions([setName, getMessages, sendMSG])