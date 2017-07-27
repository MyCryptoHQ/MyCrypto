// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as generateWalletActions from 'actions/generateWallet';
import type {
  GenerateNewWalletAction,
  ContinueToPaperAction,
  ResetGenerateWalletAction
} from 'actions/generateWallet';

import EnterPassword from './components/EnterPassword';
import DownloadWallet from './components/DownloadWallet';
import PaperWallet from './components/PaperWallet';
import type PrivKeyWallet from 'libs/wallet/privkey';
import type { State } from 'reducers';

type Props = {
  // Redux state
  activeStep: string, // FIXME union actual steps
  password: string,
  wallet: ?PrivKeyWallet,
  walletPasswordForm: Object,
  // Actions
  generateNewWallet: (pw: string) => GenerateNewWalletAction,
  continueToPaper: () => ContinueToPaperAction,
  resetGenerateWallet: () => ResetGenerateWalletAction
};

class GenerateWallet extends Component {
  props: Props;

  componentWillUnmount() {
    this.props.resetGenerateWallet();
  }

  render() {
    const { activeStep, wallet, password } = this.props;
    let content;

    switch (activeStep) {
      case 'password':
        content = (
          <EnterPassword
            walletPasswordForm={this.props.walletPasswordForm}
            generateNewWallet={this.props.generateNewWallet}
          />
        );
        break;

      case 'download':
        if (wallet) {
          content = (
            <DownloadWallet
              wallet={wallet}
              password={password}
              continueToPaper={this.props.continueToPaper}
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
    walletPasswordForm: state.form.walletPasswordForm,
    activeStep: state.generateWallet.activeStep,
    password: state.generateWallet.password,
    wallet: state.generateWallet.wallet
  };
}

export default connect(mapStateToProps, generateWalletActions)(GenerateWallet);
