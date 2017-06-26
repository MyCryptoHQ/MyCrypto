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
    showPasswordGenerateWallet: PropTypes.func,
    generateFileGenerateWallet: PropTypes.func,
    downloadFileGenerateWallet: PropTypes.func,
    confirmContinueToPaperGenerateWallet: PropTypes.func
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
