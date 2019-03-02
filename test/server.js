import Rib from '../lib/server/Rib'
let rib = new Rib(5000, 'This is much easier to program')

rib.setDefaultRoute('/', `${__dirname}/client/index.html`)
rib.setClientFolder([`${__dirname}/client/build`])

function sayHello(data, resolve, client) {
    resolve(`Hi ${ data.name }`)
}

function sayLove() {
    console.log('Love')
}

rib.exposeFunctions([sayHello, sayLove])
