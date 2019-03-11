import React from 'react'
import M from 'materialize-css'
import RibClient from '../../../lib/client/RibClient'

let myRibClient = new RibClient()

export default class LogIn extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <section className="section section-login">
                <div className="valign-wrapper row login-box">
                    <div className="col card hoverable s10 pull-s1 m6 pull-m3 l4 pull-l4 z-depth-2">
                        <form onSubmit={ this.submitName } >
                            <div className="card-content">
                                <span className="card-title">Enter login details</span>
                                <div className="row">
                                <div className="input-field col s12">
                                    <label>Name</label>
                                    <input onChange={ e => this.setState({ name: e.target.value }) } type='text' className="validate" />
                                </div>
                                </div>
                            </div>
                            <div className="card-action right-align">
                                <button className="btn waves-effect waves-light" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        )
    }

    componentDidMount() {
        M.AutoInit()
    }

    submitName = (e) => {
        e.preventDefault()
        myRibClient.setName(this.state.name, res => {
            console.log(res)
        })
    }
}