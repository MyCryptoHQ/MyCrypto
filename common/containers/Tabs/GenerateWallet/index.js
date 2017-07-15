import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as generateWalletActions from 'actions/generateWallet';
import PropTypes from 'prop-types';
import EnterPassword from './components/EnterPassword';
import SaveWallet from './components/SaveWallet';
import PaperWallet from './components/PaperWallet';
import UnlockWallet from './components/UnlockWallet';

class GenerateWallet extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    // state
    activeStep: PropTypes.string,
    walletFile: PropTypes.object,
    privateKey: PropTypes.string,
    address: PropTypes.string,
    // actions
    showPasswordGenerateWallet: PropTypes.func,
    generateUTCGenerateWallet: PropTypes.func,
    downloadUTCGenerateWallet: PropTypes.func,
    confirmContinueToPaperGenerateWallet: PropTypes.func,
    continueToUnlockWallet: PropTypes.func
  };

  render() {
    const { activeStep } = this.props;
    let content;

    switch (activeStep) {
      case 'password':
        content = <EnterPassword {...this.props} />;
        break;

      case 'download':
        content = <SaveWallet {...this.props} />;
        break;

      case 'paper':
        content = <PaperWallet {...this.props} />;
        break;

      case 'unlock':
        content = <UnlockWallet {...this.props} />;
        break;

      default:
        content = <h1>Uh oh. Not sure how you got here.</h1>;
    }

    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane active text-center" role="main">
            <section role="main" className="row">
              <br />
              {content}
            </section>
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    generateWalletPassword: state.form.generateWalletPassword,
    activeStep: state.generateWallet.activeStep,
    hasDownloadedWalletFile: state.generateWallet.hasDownloadedWalletFile,
    privateKey: state.generateWallet.privateKey,
    address: state.generateWallet.address,
    walletFile: state.generateWallet.walletFile
  };
}

export default connect(mapStateToProps, generateWalletActions)(GenerateWallet);
