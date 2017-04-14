import React, {Component} from 'react'
import GenerateWalletPasswordComponent from './GenerateWalletPasswordComponent'
import PropTypes from 'prop-types';

export default class GenerateWalletComponent extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        statistics: PropTypes.array
    }

    render() {
        return (
            <div>
                <GenerateWalletPasswordComponent/>
            </div>
        )
    }
}
