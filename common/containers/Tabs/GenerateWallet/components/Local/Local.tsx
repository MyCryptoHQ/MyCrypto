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
import Datastore from 'nedb';

let db = new Datastore({ filename: __dirname + 'wallet', autoload: true });

export enum Steps {
  Initialize = 'initialize',
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
  localWallet: boolean;
}

export default class GenerateLocal extends Component<{}, State> {
  public state: State = {
    activeStep: Steps.Initialize,
    password: '',
    keystore: null,
    filename: '',
    privateKey: '',
    isGenerating: false,
    localWallet: false
  };

  public render() {
    const { activeStep, keystore, privateKey, filename, isGenerating, localWallet } = this.state;
    let content;

    switch (activeStep) {
      case Steps.Initialize:
        this.initialize();
        content = <h2>Loading...</h2>;

      case Steps.Password:
        console.log(localWallet);
        if (localWallet) {
          content = <p>You already have a local wallet.</p>;
        } else {
          content = (
            <EnterPassword continue={this.generateWalletAndContinue} isGenerating={isGenerating} />
          );
        }

        break;

      case Steps.Download:
        if (keystore) {
          db.find({}, (err: any, docs: any) => {
            if (err) {
              console.log(err);
              alert('Something went wrong. Please download your wallet again.');
            }
            if (docs.length === 0) {
              db.insert(keystore);
            }
          });

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

  private initialize = () => {
    db = new Datastore({ filename: __dirname + 'wallet', autoload: true });

    db.find({}, (err: any, docs: any) => {
      if (err) {
        console.log(err);
        alert('Something went wrong.');
      }
      if (docs.length === 0) {
        this.setState({
          activeStep: Steps.Password,
          localWallet: false
        });
      } else {
        this.setState({
          activeStep: Steps.Password,
          localWallet: true
        });
      }
    });
  };

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
