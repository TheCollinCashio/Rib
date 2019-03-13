import React from 'react'

export default class MSG extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <ul className="collection">
                <li className="collection-item avatar">
                    <span className="title">{this.props.name}</span>
                    <p>
                        {this.props.message}
                    </p>
                </li>
            </ul>
        )
    }
}