import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import 'materialize-css/dist/css/materialize.min.css'

import Name from './Name'
import Message from './Message'
import RibClient from '../../../lib/client/RibClient'
let myRibClient = new RibClient()

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: null
        }
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Name} />
                    <Route exact path="/message" component={Message} />
                    <Route component={this.Name} />
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)

function sendMSG(msg) {
    console.log(msg)
}

myRibClient.exposeFunctions([sendMSG])


myRibClient.onConnect(() => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    )
})

if (process.env.NODE_ENV !== 'production') {
    console.log('Let\'s Develop great things 😏')
}