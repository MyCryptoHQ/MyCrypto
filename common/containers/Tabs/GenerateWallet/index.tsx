import * as generateWalletActions from 'actions/generateWallet';
import {
  ContinueToPaperAction,
  GenerateNewWalletAction,
  ResetGenerateWalletAction
} from 'actions/generateWallet';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import PrivKeyWallet from 'libs/wallet/privkey';
import { State } from 'reducers';
import DownloadWallet from './components/DownloadWallet';
import EnterPassword from './components/EnterPassword';
import PaperWallet from './components/PaperWallet';

interface Props {
  // Redux state
  activeStep: string; // FIXME union actual steps
  password: string;
  wallet?: PrivKeyWallet;
  walletPasswordForm: Object;
  // Actions
  generateNewWallet(pw: string): GenerateNewWalletAction;
  continueToPaper(): ContinueToPaperAction;
  resetGenerateWallet(): ResetGenerateWalletAction;
}

class GenerateWallet extends Component<Props, {}> {
  public componentWillUnmount() {
    this.props.resetGenerateWallet();
  }

  public render() {
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
      <section className="Tab-content">
        {content}
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
