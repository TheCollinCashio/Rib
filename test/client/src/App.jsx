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

function noLove(msg) {
    console.log(msg)
}

myRibClient.exposeFunctions([tellAllClientsHello, noLove])


myRibClient.onConnect(() => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    )

    myRibClient.sayHello({ name: 'Collin' }, res => {
        console.log(res)
    })

    myRibClient.sayLove({}, res => {
        console.log(res)
    })
})

if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('Let\'s Develop great things 😏')
}