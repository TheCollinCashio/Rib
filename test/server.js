import Rib from '../lib/server/Rib'
let rib = new Rib(5000, 'This is much easier to program')

rib.setDefaultRoute('/', `${__dirname}/client/index.html`)
rib.setClientFolder([`${__dirname}/client/build`])

function sayHello(res) {
    console.log('Hello')
    res('Hi')
}

function sayLove() {
    console.log('Love')
}

rib.exposeFunctions([sayHello, sayLove])
