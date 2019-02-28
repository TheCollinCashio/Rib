const rib = require('../dist/Rib')

rib.setPort(3000)

rib.setDefaultRoute('/', `${__dirname}/index.html`)
rib.setClientFolder(`${__dirname}/client`)
