import Rib from '../lib/server/Rib'
Rib.startServer(5000, 'This is much easier to program')

let myRib = new Rib()
myRib.onConnect(() => {
    setInterval(() => {
        myRib.tellAllClientsHello('Hello from the other side')
    }, 2000)
})

myRib.setDefaultRoute('/', `${__dirname}/client/index.html`)
myRib.setClientFolder([`${__dirname}/client/build`])

function sayHello(data, resolve, client) {
    resolve(`Hi ${ data.name }`)
}

function sayLove() {
    console.log('Love')
}

myRib.exposeFunctions([sayHello, sayLove])