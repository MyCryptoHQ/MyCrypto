import React, { Component, ReactType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IV3Wallet } from 'ethereumjs-wallet';
import { addHexPrefix, toChecksumAddress } from 'ethereumjs-util';

import { makeBlob } from 'utils/blob';
import { N_FACTOR } from 'config';
import { generateKeystore, fromV3 } from 'libs/web-workers';
import { stripHexPrefix } from 'libs/formatters';
import { getPrivKeyWallet } from 'libs/wallet/non-deterministic/wallets';
import { Layout } from 'v2/features';
import { KeystoreStages, keystoreStageToComponentHash, keystoreFlow } from './constants';
import { NotificationTemplates } from 'v2/providers/NotificationsProvider/constants';
import { getNetworkByName } from 'v2/libs';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';
import { Account } from 'v2/services/Account/types';
import { WalletName, InsecureWalletName } from 'v2/config/data';
import { withAccountAndNotificationsContext } from '../components/withAccountAndNotificationsContext';

interface State {
  password: string;
  privateKey: string;
  keystore?: IV3Wallet;
  filename: string;
  network: string;
  stage: KeystoreStages;
  isGenerating: boolean;
  accountType: WalletName;
}

interface Props extends RouteComponentProps<{}> {
  createAccount(accountData: Account): void;
  displayNotification(templateName: string, templateData?: object): void;
}

class CreateWallet extends Component<Props, State> {
  public state: State = {
    password: '',
    privateKey: '',
    filename: '',
    network: 'Ethereum',
    stage: KeystoreStages.GenerateKeystore,
    isGenerating: false,
    accountType: InsecureWalletName.KEYSTORE_FILE
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
      selectNetwork: this.selectNetwork,
      getKeystoreBlob: this.getKeystoreBlob,
      verifyKeystore: this.verifyKeystore,
      verifyPrivateKey: this.verifyPrivateKey,
      addCreatedAccountAndRedirectToDashboard: this.addCreatedAccountAndRedirectToDashboard
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

  private addCreatedAccountAndRedirectToDashboard = () => {
    const { history, createAccount, displayNotification } = this.props;
    const { keystore, network, accountType } = this.state;

    if (!keystore) {
      return;
    }

    const accountNetwork: NetworkOptions | undefined = getNetworkByName(network);
    const account: Account = {
      address: toChecksumAddress(addHexPrefix(keystore.address)),
      network,
      accountType,
      derivationPath: '',
      assets: accountNetwork ? accountNetwork.unit : 'DefaultAsset',
      value: 0,
      label: 'New Account', // @TODO: we really should have the correct label before!
      localSettings: 'default',
      transactionHistory: ''
    };
    createAccount(account);
    displayNotification(NotificationTemplates.walletCreated, {
      address: account.address
    });
    history.replace('/dashboard');
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

  private selectNetwork = async (network: string) => {
    this.setState({ network });
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

export default withAccountAndNotificationsContext(CreateWallet);
