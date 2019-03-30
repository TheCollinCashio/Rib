import React from 'react'
import M from 'materialize-css'
import RibClient from 'rib-client'
import MSG from './components/MSG'
import messageStore from './stores/message'

let myRibClient = new RibClient()

export default class Message extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            message: '',
            messages: []
        }
    }

    render(){
        return (
            <React.Fragment>
                <div>
                    Message Board
                </div>
                { this.state.messages.map((message, index) => {
                    return (
                        <MSG key={index} name={message.name} message={message.message} />
                    )
                }) }
                <nav className="bottom">
                    <div className="nav-wrapper">
                        <form onSubmit={this.sendMessage}>
                            <div className="input-field">
                                <input id="search" type="search" onChange={ e => this.updateMessage(e.target.value) } value={this.state.message} required />
                                <label className="label-icon" htmlFor="search"><i className="material-icons">send</i></label>
                                <i className="material-icons">close</i>
                            </div>
                        </form>
                    </div>
                </nav>
            </React.Fragment>
        )
    }

    componentDidMount() {
        M.AutoInit()
        let storeObj = messageStore.get({ messages: [] })
        this.unbindMessageStore = messageStore.set(storeObj, this.updateState)
    }

    sendMessage = async (e) => {
        e.preventDefault()
        let { message } = this.state
        let res = await myRibClient.sendMSG(message)
        if (res === 'MSG Sent') {
            console.log('Did it')
        }
        this.updateMessage('')
    }

    updateMessage = (message) => {
        this.setState({ message })
    }

    updateState = (newState) => {
        this.setState(newState)
    }

    componentWillUnmount() {
        this.unbindMessageStore()
    }
}