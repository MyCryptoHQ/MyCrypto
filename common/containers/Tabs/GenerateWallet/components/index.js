import React, {Component} from 'react'
import GenerateWalletPasswordComponent from './GenerateWalletPasswordComponent'
import PropTypes from 'prop-types';

export default class GenerateWalletComponent extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        generateWalletPassword: PropTypes.object,
        showPassword: PropTypes.bool,
        showGenerateWalletPasswordAction: PropTypes.func,
        generateWalletFileAction: PropTypes.func,
        generateWalletFile: PropTypes.bool
    }

    render() {
        return (
            <div>
                <GenerateWalletPasswordComponent {...this.props}/>
            </div>
        )
    }
}
