import React, { Component, ReactType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { addHexPrefix, toChecksumAddress, privateToAddress } from 'ethereumjs-util';
import HDkey from 'hdkey';

import { Layout } from 'v2/features';
import { MnemonicStages, mnemonicStageToComponentHash, mnemonicFlow } from './constants';
import { withAccountAndNotificationsContext } from '../components/withAccountAndNotificationsContext';
import { InsecureWalletName } from 'v2/config/data';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';
import { NotificationTemplates } from 'v2/providers/NotificationsProvider/constants';
import { getNetworkByName } from 'v2/libs';
import { DPathFormat } from 'v2/libs/networks/types';
import { Account } from 'v2/services/Account/types';
import _ from 'lodash';

interface Props extends RouteComponentProps<{}> {
  createAccount(accountData: Account): void;
  displayNotification(templateName: string, templateData?: object): void;
}

interface State {
  network: string;
  stage: MnemonicStages;
  words: string[];
  accountType: DPathFormat;
  path: string;
  address: string;
  unit: string;
}

class CreateWallet extends Component<Props> {
  public state: State = {
    stage: MnemonicStages.SelectNetwork,
    words: [],
    network: 'Ethereum',
    accountType: InsecureWalletName.MNEMONIC_PHRASE,
    path: `m/44'/60'/0'/0`,
    address: '',
    unit: 'ETH'
  };

  public render() {
    const { stage } = this.state;
    const currentStep: number = mnemonicFlow.indexOf(stage) + 1;
    const totalSteps: number = mnemonicFlow.length;
    const ActivePanel: ReactType = mnemonicStageToComponentHash[stage];
    const actions = {
      onBack: this.regressToPreviousStage,
      onNext: this.advanceToNextStage,
      navigateToDashboard: this.navigateToDashboard,
      generateWords: this.generateWords,
      selectNetwork: this.selectNetwork,
      decryptMnemonic: this.decryptMnemonic,
      addCreatedAccountAndRedirectToDashboard: this.addCreatedAccountAndRedirectToDashboard
    };

    return (
      <Layout centered={true}>
        <ActivePanel
          currentStep={currentStep}
          totalSteps={totalSteps}
          {...this.state}
          {...actions}
        />
      </Layout>
    );
  }

  private regressToPreviousStage = () => {
    const { history } = this.props;
    const { stage } = this.state;
    const currentIndex = mnemonicFlow.indexOf(stage);
    const previousStage = mnemonicFlow[currentIndex - 1];

    if (previousStage != null) {
      this.setState({ stage: previousStage });
    } else {
      history.push('/create-wallet');
    }
  };

  private advanceToNextStage = () => {
    const { stage } = this.state;
    const currentIndex = mnemonicFlow.indexOf(stage);
    const nextStage = mnemonicFlow[currentIndex + 1];

    if (nextStage != null) {
      this.setState({ stage: nextStage });
    }
  };

  private navigateToDashboard = () => {
    const { history } = this.props;
    history.replace('/dashboard');
  };

  private generateWords = () => {
    let words = generateMnemonic().split(' ');

    // Prevent duplicate words in mnemonic phrase
    while (_.uniq(words).length !== words.length) {
      words = generateMnemonic().split(' ');
    }

    this.setState({
      words
    });
  };

  private selectNetwork = async (network: string) => {
    const accountNetwork: NetworkOptions | undefined = getNetworkByName(network);

    const pathFormat = accountNetwork && accountNetwork.dPathFormats[this.state.accountType];
    const path = (pathFormat && pathFormat.value) || '';
    const unit = (accountNetwork && accountNetwork.unit) || 'DefaultAsset';
    this.setState({ network, path, unit });
  };

  private decryptMnemonic = () => {
    const { words, path } = this.state;

    const phrase = words.join(' ').trim();
    const seed = mnemonicToSeed(phrase);
    const derived = HDkey.fromMasterSeed(seed).derive(path);
    const privateKey = derived.privateKey;
    const address = privateToAddress(privateKey).toString('hex');

    this.setState({ address });
  };

  private addCreatedAccountAndRedirectToDashboard = () => {
    const { history, createAccount, displayNotification } = this.props;
    const { network, accountType, address, unit } = this.state;

    const account: Account = {
      address: toChecksumAddress(addHexPrefix(address)),
      network,
      accountType,
      derivationPath: '',
      assets: unit,
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
}

export default withAccountAndNotificationsContext(CreateWallet);
