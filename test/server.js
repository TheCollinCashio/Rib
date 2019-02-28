const rib = require('../dist/Rib')

rib.setPort(3000)

rib.setDefaultRoute('/', `${__dirname}/client/index.html`)
rib.setClientFolder(`${__dirname}/client`)
