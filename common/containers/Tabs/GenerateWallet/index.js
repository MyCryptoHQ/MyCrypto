// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as generateWalletActions from 'actions/generateWallet';
import PropTypes from 'prop-types';
import EnterPassword from './components/EnterPassword';
import DownloadWallet from './components/DownloadWallet';
import PaperWallet from './components/PaperWallet';
import type PrivKeyWallet from 'libs/wallet/privkey';
import type { State } from 'reducers';

type Props = {
  // FIXME union actual steps
  activeStep: string,
  password: string,
  hasDownloadedWalletFile: boolean,
  wallet: ?PrivKeyWallet
} & typeof generateWalletActions;

class GenerateWallet extends Component {
  props: Props;
  static propTypes = {
    // Store state
    activeStep: PropTypes.string,
    wallet: PropTypes.object,
    password: PropTypes.string,
    hasDownloadedWalletFile: PropTypes.bool,
    // Actions
    showPasswordGenerateWallet: PropTypes.func,
    generateUTCGenerateWallet: PropTypes.func,
    downloadUTCGenerateWallet: PropTypes.func,
    confirmContinueToPaperGenerateWallet: PropTypes.func,
    resetGenerateWallet: PropTypes.func
  };

  componentWillUnmount() {
    this.props.resetGenerateWallet();
  }

  render() {
    const { activeStep, wallet, password } = this.props;
    let content;

    switch (activeStep) {
      case 'password':
        content = <EnterPassword {...this.props} />;
        break;

      case 'download':
        if (wallet) {
          content = (
            <DownloadWallet
              hasDownloadedWalletFile={this.props.hasDownloadedWalletFile}
              wallet={wallet}
              password={password}
              downloadUTCGenerateWallet={this.props.downloadUTCGenerateWallet}
              confirmContinueToPaperGenerateWallet={
                this.props.confirmContinueToPaperGenerateWallet
              }
            />
          );
        }
        break;

      case 'paper':
        if (wallet) {
          content = <PaperWallet wallet={wallet} />;
        } else {
          content = <h1>Uh oh. Not sure how you got here.</h1>;
        }
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

function mapStateToProps(state: State) {
  return {
    generateWalletPassword: state.form.generateWalletPassword,
    activeStep: state.generateWallet.activeStep,
    password: state.generateWallet.password,
    hasDownloadedWalletFile: state.generateWallet.hasDownloadedWalletFile,
    wallet: state.generateWallet.wallet,
    walletFile: state.generateWallet.walletFile
  };
}

export default connect(mapStateToProps, generateWalletActions)(GenerateWallet);
