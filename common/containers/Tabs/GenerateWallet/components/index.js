import React, {Component} from 'react'
import {Card, Loader, Grid} from 'semantic-ui-react'
import GenerateWalletPasswordComponent from './GenerateWalletPasswordComponent'

export default class GenerateWalletComponent extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        statistics: React.PropTypes.array
    }

    render() {
        return (
            <div>
                <GenerateWalletPasswordComponent/>
            </div>
        )
    }
}
