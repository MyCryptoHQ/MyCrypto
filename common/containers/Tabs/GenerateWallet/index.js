import GenerateWalletPasswordComponent from './components/GenerateWalletPasswordComponent';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    GENERATE_WALLET_FILE_ACTION,
    GENERATE_WALLET_HAS_DOWNLOADED_FILE_ACTION,
    SHOW_GENERATE_WALLET_PASSWORD_ACTION,
    GENERATE_WALLET_CONTINUE_TO_PAPER_ACTION
} from 'actions/generateWallet';
import PropTypes from 'prop-types';

class GenerateWallet extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        generateWalletPassword: PropTypes.object,
        showPassword: PropTypes.bool,
        hasDownloadedWalletFile: PropTypes.bool,
        showGenerateWalletPasswordAction: PropTypes.func,
        generateWalletFileAction: PropTypes.func,
        generateWalletHasDownloadedFileAction: PropTypes.func,
        generateWalletFile: PropTypes.bool,
        generateWalletContinueToPaperAction: PropTypes.func,
        canProceedToPaper: PropTypes.bool
    }

    render() {
        return (
            <GenerateWalletPasswordComponent {...this.props}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        generateWalletPassword: state.form.generateWalletPassword,
        generateWalletFile: state.generateWallet.generateWalletFile,
        showPassword: state.generateWallet.showPassword,
        hasDownloadedWalletFile: state.generateWallet.hasDownloadedWalletFile,
        canProceedToPaper: state.generateWallet.canProceedToPaper
    }
}

function mapDispatchToProps(dispatch) {
    return {
        showGenerateWalletPasswordAction: () => {
            dispatch(SHOW_GENERATE_WALLET_PASSWORD_ACTION())
        },
        generateWalletFileAction: () => {
            dispatch(GENERATE_WALLET_FILE_ACTION())
        },
        generateWalletHasDownloadedFileAction: () => {
            dispatch(GENERATE_WALLET_HAS_DOWNLOADED_FILE_ACTION())
        },
        generateWalletContinueToPaperAction: () => {
            dispatch(GENERATE_WALLET_CONTINUE_TO_PAPER_ACTION())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateWallet)
