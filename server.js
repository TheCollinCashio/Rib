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
    client.sendMSG('Welcome to this example app.')
    myRib.sendMSG('WE HAVE A NEW PLAYER IN TOWN...', { exclude: client })
})

function setName(name, func, client) {
    client.name = name
    client.sendMSG(`Welcome, ${name}`)
    myRib.sendMSG(`Their name is ${name}...`, { exclude: client })
    func('Name set on server')
}

function getMessages(func, client) {
    if(client.name) {
        func(messages)
    }
}

function sendMSG(message, func, client) {
    if (client.name) {
        myRib.concealFunction(setName, client)

        let msgObj = {
            name: client.name,
            message: message
        }

        let storeObj = myServerStore.get({ messages: [] })
        let messages = [...storeObj.messages, msgObj]
        myServerStore.set({ messages })

        func('MSG Sent')
    }
}

myRib.exposeFunctions([setName, getMessages, sendMSG])