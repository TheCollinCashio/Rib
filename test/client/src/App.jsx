import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import RibClient from '../../../lib/client/RibClient'

let myRibClient = new RibClient()

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
    typography: {
        useNextVariants: true,
    },
})

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: null
        }
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <React.Fragment>
                    <TextField label="Input Name" onChange={(e) => this.setState({ name: e.target.value })} />
                    <Button color="primary" onClick={this.submitName}>Submit name</Button>
                </React.Fragment>
            </MuiThemeProvider>
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