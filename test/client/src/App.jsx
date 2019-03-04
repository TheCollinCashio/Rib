import React from 'react'
import ReactDOM from 'react-dom'
import RibClient from '../../../lib/client/RibClient'
let myRibClient = new RibClient()

export default class App extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                Hello, welcome to this simple app
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)

function tellAllClientsHello(msg) {
    console.log(msg)
}

function sendMSG(msg) {
    console.log(msg)
}

myRibClient.exposeFunctions([tellAllClientsHello, sendMSG])


myRibClient.onConnect(() => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    )

    myRibClient.sayHello({ name: 'Collin' }, res => {
        console.log(res)
    })

    myRibClient.strictEqual('2', '2', (res, err) => {
        if (err) {
            console.error(err)
        } else {
            console.log(res)
        }
    })
})

if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('Let\'s Develop great things 😏')
}