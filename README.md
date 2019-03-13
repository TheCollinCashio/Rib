# Rib 🥩
A framework for a Realtime Integrated Backend

## Getting Started

These instructions will show you how simple it is to create a real time application using Rib.

### Prerequisites

First, you are going to need to install Rib for the dynamic server communication as well as some simple functions to start your server.

```
npm install rib-server
```

Next, you are going to need to install RibClient for the dynamic client communication 👨🏻‍💻:
```
npm install rib-client
```

#### Optional 🏬
If you would like to install RibClientStore, a simple state management solution for frontend frameworks, please install the following:

```
npm install rib-store
```

## Usage

On the server we have,

```js
let RibServer = require('rib-server')
RibServer.startServer(5000, 'This is much easier to program')
RibServer.setRoute('/', `${__dirname}/client/index.html`)
RibServer.setClientFolder([`${__dirname}/client/build`])

let myRib = new RibServer()
myRib.onConnect((client) => {
    client.sendMSG('Welcome to this example 😃')
})

function logMessage(msg) {
    console.log(msg)
}

myRib.exposeFunction(logMessage)    // allows us to call logMessage from the client
```

& on the client we have,

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
