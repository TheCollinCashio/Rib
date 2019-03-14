# Rib 🥩

### What is Rib?
Rib *(Realtime integrated backend)* is an open-source framework for building realtime applications. 
It provides an easy way to manage realtime communication between client and server.

Rib consists of two main packages:
- **rib-server**: provides an easy way to create, scale, and manage realtime applications on the server.
- **rib-client**: allows users to call server side functions directly.

## Getting Started
### First, install all of the things 👨🏻‍💻:
```
npm install rib-server rib-client
```

### Optional 🏬
If you would like a simple state management solution for frontend frameworks, please install the following:
```
npm install rib-store
```

## Usage
#### Server.js
```js
let RibServer = require('rib-server')
RibServer.startServer(5000, 'This is much easier to program')
RibServer.setRoute('/', `${__dirname}/client/index.html`)
RibServer.setClientFolder(`${__dirname}/client/build`)

let myRib = new RibServer()
myRib.onConnect((client) => {
    client.sendMSG('Welcome to this example 😃')
})

function logMessage(msg) {
    console.log(msg)
}

myRib.exposeFunction(logMessage)    // allows us to call logMessage from the client
```

#### Client.js
```js
let RibClient = require('rib-client') // or import using a CDN
let myRib = new RibClient()

myRib.onConnect(() => {
    myRib.logMessage('Runs the logMessage function server side 👨🏻‍💻')
})

function sendMSG(msg) {
    console.log(msg)
}

myRib.exposeFunctions([sendMSG])   //  allows us to call sendMSG from the server
```


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
