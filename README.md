# Rib 🥩

### What is Rib?
Rib *(Realtime integrated backend)* is an open-source framework for building real-time applications. 
It provides an easy way to manage realtime communication between client and server.

Rib consists of two main packages:
- [**rib-server**](https://www.npmjs.com/package/rib-server): provides an easy way to create, scale, and manage your real-time applications on the server.
- [**rib-client**](https://www.npmjs.com/package/rib-client): provides an easy way to call server side functions directly from the client.

## Getting Started
### First, install all of the things 👨🏻‍💻:
```
npm install rib-server rib-client
```

## Usage
#### Server.js
```js
let RibServer = require("rib-server").default
RibServer.startServer(5000, "This is much easier to program")
RibServer.setRoute("/", `${__dirname}/client/index.html`)
RibServer.setClientFolder({ path: "/Home/Client/", fullPath: `${ __dirname }/Home/Client/` })

let myRib = new RibServer()
myRib.onConnect((client) => {
    myRib.sendMSG("Welcome to this example 😃", { query: client })
})

function logMessage(msg) {
    console.log(msg)
}

myRib.exposeFunction(logMessage)    // allows us to call logMessage from the client
```

#### Client.js
```js
let RibClient = require("rib-client").default // or import using a CDN
let myRib = new RibClient("http://localhost:5000/")

myRib.onConnect(() => {
    myRib.logMessage("Runs the logMessage function server side 👨🏻‍💻")
})

function sendMSG(msg) {
    console.log(msg)
}

myRib.exposeFunctions([sendMSG])   //  allows us to call sendMSG from the server
```


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
