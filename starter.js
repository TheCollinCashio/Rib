//  Transpile All Code with Babel and use 'env' (ES6+) Preset
require('@babel/register')()
require('@babel/polyfill')

// Import Application
module.exports = require('./server.js')