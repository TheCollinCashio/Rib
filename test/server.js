import Rib from '../lib/server/Rib'
import path from 'path'
let rib = new Rib(5000, 'This is much easier to program')

rib.setDefaultRoute('/', `${__dirname}/client/index.html`)
rib.setClientFolder([`${__dirname}/client`, path.resolve(__dirname, '../lib/client/')])
rib.addRoute(function getSomething() {
    console.log('It worked!!')
})
