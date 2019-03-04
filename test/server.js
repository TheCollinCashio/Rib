import Rib from '../lib/server/Rib'
Rib.startServer(5000, 'This is much easier to program')

let myRib = new Rib()

myRib.onConnect((client) => {
    client.sendMSG('Welcome to this example app.')
    myRib.sendMSG('WE HAVE A NEW PLAYER IN TOWN...', { exclude: client })
})

myRib.setDefaultRoute('/', `${__dirname}/client/index.html`)
myRib.setClientFolder([`${__dirname}/client/build`])

function setName(name, func, client) {
    client.name = name

    client.sendMSG(`Welcome, ${name}`)
    myRib.sendMSG(`Their name is ${name}...`, { exclude: client })
    func('Name set on server')
}

myRib.exposeFunctions([setName])