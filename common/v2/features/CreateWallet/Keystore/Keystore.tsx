import React, { Component, ReactType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IV3Wallet } from 'ethereumjs-wallet';

import { makeBlob } from 'utils/blob';
import { N_FACTOR } from 'config';
import { generateKeystore, fromV3 } from 'libs/web-workers';
import { stripHexPrefix } from 'libs/formatters';
import { getPrivKeyWallet } from 'libs/wallet/non-deterministic/wallets';
import { Layout } from 'v2/features';
import { KeystoreStages, keystoreStageToComponentHash, keystoreFlow } from './constants';

interface State {
  password: string;
  privateKey: string;
  keystore?: IV3Wallet;
  filename: string;
  network: string;
  stage: KeystoreStages;
  isGenerating: boolean;
}

export default class CreateWallet extends Component<RouteComponentProps<{}>, State> {
  public state: State = {
    password: '',
    privateKey: '',
    filename: '',
    network: '',
    stage: KeystoreStages.GenerateKeystore,
    isGenerating: false
  };

  public render() {
    const { stage } = this.state;
    const currentStep: number = keystoreFlow.indexOf(stage) + 1;
    const totalSteps: number = keystoreFlow.length;
    const ActivePanel: ReactType = keystoreStageToComponentHash[stage];
    const actions = {
      onBack: this.regressToPreviousStage,
      onNext: this.advanceToNextStage,
      generateWalletAndContinue: this.generateWalletAndContinue,
      selectNetworkAndContinue: this.selectNetworkAndContinue,
      getKeystoreBlob: this.getKeystoreBlob,
      verifyKeystore: this.verifyKeystore,
      verifyPrivateKey: this.verifyPrivateKey
    };

    return (
      <Layout centered={true}>
        <ActivePanel
          currentStep={currentStep}
          totalSteps={totalSteps}
          {...actions}
          {...this.state}
        />
      </Layout>
    );
  }

  private regressToPreviousStage = () => {
    const { history } = this.props;
    const { stage } = this.state;
    const currentIndex = keystoreFlow.indexOf(stage);
    const previousStage = keystoreFlow[currentIndex - 1];

    if (previousStage != null) {
      this.setState({ stage: previousStage });
    } else {
      history.push('/');
    }
  };

  private advanceToNextStage = () => {
    const { stage } = this.state;
    const currentIndex = keystoreFlow.indexOf(stage);
    const nextStage = keystoreFlow[currentIndex + 1];

    if (nextStage != null) {
      this.setState({ stage: nextStage });
    }
  };

  private generateWalletAndContinue = async (password: string) => {
    this.setState({ isGenerating: true });
    try {
      const res = await generateKeystore(password, N_FACTOR);
      this.setState({
        password,
        keystore: res.keystore,
        filename: res.filename,
        privateKey: stripHexPrefix(res.privateKey),
        isGenerating: false
      });
      this.advanceToNextStage();
    } catch (e) {
      console.log(e);
    }
  };

  private selectNetworkAndContinue = async (network: string) => {
    this.setState({ network });
    this.advanceToNextStage();
  };

  private getKeystoreBlob = (): string => {
    return makeBlob('text/json;charset=UTF-8', JSON.stringify(this.state.keystore));
  };

  private verifyKeystore = async (keystore: string, password: string): Promise<boolean> => {
    try {
      await fromV3(keystore, password, true);
      return true;
    } catch (e) {
      return false;
    }
  };

  private verifyPrivateKey = (key: string, password: string): boolean => {
    try {
      getPrivKeyWallet(key, password);
      return true;
    } catch (e) {
      return false;
    }
  };
}
