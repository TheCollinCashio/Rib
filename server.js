import RibServer from 'rib-server'
RibServer.startServer(5000, 'This is much easier to program')
RibServer.setRoute('/', `${__dirname}/client/index.html`)
RibServer.setClientFolder([`${__dirname}/client/build`])

let myRib = new RibServer()
let messages = []

//  Safely expose functions
myRib.possibleClientFunctions(['sendMSG', 'bindLog'])

myRib.onConnect((client) => {
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
        let msgObj = {
            name: client.name,
            message: message
        }
        messages.push(msgObj)
        func('MSG Sent')
    }
}

myRib.exposeFunctions([setName, getMessages, sendMSG])