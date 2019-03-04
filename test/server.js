import Rib from '../lib/server/Rib'
Rib.startServer(5000, 'This is much easier to program')

let myRib = new Rib()

myRib.onConnect((client) => {
    client.sendMSG('Welcome, new comer')
    myRib.sendMSG('HELLO! WE HAVE A NEW PLAYER IN TOWN!!', { exclude: client })
})

myRib.setDefaultRoute('/', `${__dirname}/client/index.html`)
myRib.setClientFolder([`${__dirname}/client/build`])

function sayHello(data, func, client) {
    func(`Hi ${ data.name }`)
}

function strictEqual(var1, var2, func, client) {
    if (var1 === var2) {
        func('Everything is good')
        client.sendMSG(`${var1} === ${var2}. How cool is that?`)
    } else {
        func(null, 'Everything is not good')
    }
}

myRib.exposeFunctions([sayHello, strictEqual])