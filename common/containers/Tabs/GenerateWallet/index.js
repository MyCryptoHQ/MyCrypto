import GenerateWalletPasswordComponent from './components/GenerateWalletPasswordComponent';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as generateWalletActions from 'actions/generateWallet';
import PropTypes from 'prop-types';

class GenerateWallet extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    // state
    generateWalletPassword: PropTypes.object,
    showPassword: PropTypes.bool,
    hasDownloadedWalletFile: PropTypes.bool,
    generateWalletFile: PropTypes.bool,
    canProceedToPaper: PropTypes.bool,
    // actions
    SHOW_GENERATE_WALLET_PASSWORD_ACTION: PropTypes.func,
    GENERATE_WALLET_FILE_ACTION: PropTypes.func,
    GENERATE_WALLET_HAS_DOWNLOADED_FILE_ACTION: PropTypes.func,
    GENERATE_WALLET_CONTINUE_TO_PAPER_ACTION: PropTypes.func
  };

  render() {
    return <GenerateWalletPasswordComponent {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    generateWalletPassword: state.form.generateWalletPassword,
    generateWalletFile: state.generateWallet.generateWalletFile,
    showPassword: state.generateWallet.showPassword,
    hasDownloadedWalletFile: state.generateWallet.hasDownloadedWalletFile,
    canProceedToPaper: state.generateWallet.canProceedToPaper
  };
}

export default connect(mapStateToProps, generateWalletActions)(GenerateWallet);
