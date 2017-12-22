import { generate, IFullWallet } from 'ethereumjs-wallet';
import React, { Component } from 'react';
import { WalletType } from '../../GenerateWallet';
import Template from '../Template';
import DownloadWallet from './DownloadWallet';
import EnterPassword from './EnterPassword';
import PaperWallet from './PaperWallet';
import FinalSteps from '../FinalSteps';

export enum Steps {
  Password = 'password',
  Download = 'download',
  Paper = 'paper',
  Final = 'final'
}

interface State {
  activeStep: Steps;
  password: string;
  wallet: IFullWallet | null | undefined;
}

export default class GenerateKeystore extends Component<{}, State> {
  public state: State = {
    activeStep: Steps.Password,
    password: '',
    wallet: null
  };

  public render() {
    const { activeStep, wallet, password } = this.state;
    let content;

    switch (activeStep) {
      case Steps.Password:
        content = <EnterPassword continue={this.generateWalletAndContinue} />;
        break;

      case Steps.Download:
        if (wallet) {
          content = (
            <DownloadWallet wallet={wallet} password={password} continue={this.continueToPaper} />
          );
        }
        break;

      case Steps.Paper:
        if (wallet) {
          content = <PaperWallet wallet={wallet} continue={this.continueToFinal} />;
        }
        break;

      case Steps.Final:
        content = (
          <Template>
            <FinalSteps walletType={WalletType.Keystore} />
          </Template>
        );
        break;

      default:
        content = <h1>Uh oh. Not sure how you got here.</h1>;
    }

    return content;
  }

  private generateWalletAndContinue = (password: string) => {
    this.setState({
      password,
      activeStep: Steps.Download,
      wallet: generate()
    });
  };

  private continueToPaper = () => {
    this.setState({ activeStep: Steps.Paper });
  };

  private continueToFinal = () => {
    this.setState({ activeStep: Steps.Final });
  };
}
