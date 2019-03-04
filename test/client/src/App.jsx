import React from 'react'
import ReactDOM from 'react-dom'
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
            <React.Fragment>
                <input type="text" placeholder="Input name" onChange={(e) => this.setState({ name: e.target.value })}/>
                <button onClick={this.submitName}>Submit name</button>
            </React.Fragment>
        )
    }

    submitName = () => {
        myRibClient.setName(this.state.name, res => {
            console.log(res)
        })
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
    // eslint-disable-next-line no-console
    console.log('Let\'s Develop great things 😏')
}