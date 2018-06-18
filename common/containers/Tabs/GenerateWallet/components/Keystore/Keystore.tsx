import React, { Component } from 'react';
import { IV3Wallet } from 'ethereumjs-wallet';

import { N_FACTOR } from 'config';
import { generateKeystore } from 'libs/web-workers';
import { WalletType } from '../../GenerateWallet';
import Template from '../Template';
import FinalSteps from '../FinalSteps';
import DownloadWallet from './DownloadWallet';
import EnterPassword from './EnterPassword';
import PaperWallet from './PaperWallet';

export enum Steps {
  Password = 'password',
  Download = 'download',
  Paper = 'paper',
  Final = 'final'
}

interface State {
  activeStep: Steps;
  password: string;
  keystore: IV3Wallet | null | undefined;
  filename: string;
  privateKey: string;
  isGenerating: boolean;
}

export default class GenerateKeystore extends Component<{}, State> {
  public state: State = {
    activeStep: Steps.Password,
    password: '',
    keystore: null,
    filename: '',
    privateKey: '',
    isGenerating: false
  };

  public render() {
    const { activeStep, keystore, privateKey, filename, isGenerating } = this.state;
    let content;

    switch (activeStep) {
      case Steps.Password:
        content = (
          <EnterPassword continue={this.generateWalletAndContinue} isGenerating={isGenerating} />
        );
        break;

      case Steps.Download:
        if (keystore) {
          content = (
            <DownloadWallet
              keystore={keystore}
              filename={filename}
              continue={this.continueToPaper}
            />
          );
        }
        break;

      case Steps.Paper:
        if (keystore) {
          content = (
            <PaperWallet
              keystore={keystore}
              privateKey={privateKey}
              continue={this.continueToFinal}
            />
          );
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
    this.setState({ isGenerating: true });

    generateKeystore(password, N_FACTOR).then(res => {
      this.setState({
        password,
        activeStep: Steps.Download,
        keystore: res.keystore,
        filename: res.filename,
        privateKey: res.privateKey,
        isGenerating: false
      });
    });
  };

  private continueToPaper = () => {
    this.setState({ activeStep: Steps.Paper });
  };

  private continueToFinal = () => {
    this.setState({ activeStep: Steps.Final });
  };
}
