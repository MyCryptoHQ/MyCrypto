import React, { Component, ReactType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { addHexPrefix, toChecksumAddress, privateToAddress } from 'ethereumjs-util';
import HDkey from 'hdkey';
import { uniq } from 'lodash';

import { MnemonicStages, mnemonicStageToComponentHash, mnemonicFlow } from './constants';
import { withAccountAndNotificationsContext } from '../components/withAccountAndNotificationsContext';
import { NotificationTemplates } from 'v2/providers/NotificationsProvider/constants';
import { Account, Asset, DPathFormat, ISettings, InsecureWalletName, Network } from 'v2/types';
import { generateUUID } from 'v2/utils';
import { getNewDefaultAssetTemplateByNetwork, getNetworkByName } from 'v2/services/Store';
import { ROUTE_PATHS } from 'v2/config';

interface Props extends RouteComponentProps<{}> {
  settings: ISettings;
  createAccountWithID(accountData: Account, uuid: string): void;
  updateSettingsAccounts(accounts: string[]): void;
  createAssetWithID(value: Asset, id: string): void;
  displayNotification(templateName: string, templateData?: object): void;
}

interface State {
  network: string;
  stage: MnemonicStages;
  words: string[];
  accountType: DPathFormat;
  path: string;
  address: string;
}

class CreateMnemonic extends Component<Props> {
  public state: State = {
    stage: MnemonicStages.SelectNetwork,
    words: [],
    network: '',
    accountType: InsecureWalletName.MNEMONIC_PHRASE,
    path: '',
    address: ''
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

    const { words, network, accountType, path, address } = this.state;
    const props = { words, network, accountType, path, address };

    return (
      <ActivePanel currentStep={currentStep} totalSteps={totalSteps} {...props} {...actions} />
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
      history.push(ROUTE_PATHS.CREATE_WALLET.path);
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
    history.replace(ROUTE_PATHS.DASHBOARD.path);
  };

  private generateWords = () => {
    let words = generateMnemonic().split(' ');

    // Prevent duplicate words in mnemonic phrase
    while (uniq(words).length !== words.length) {
      words = generateMnemonic().split(' ');
    }

    this.setState({
      words
    });
  };

  private selectNetwork = async (network: string) => {
    const accountNetwork: Network | undefined = getNetworkByName(network);
    const pathFormat = accountNetwork && accountNetwork.dPaths[this.state.accountType];
    const path = (pathFormat && pathFormat.value) || '';
    this.setState({ network, path });
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
    const {
      history,
      settings,
      createAccountWithID,
      updateSettingsAccounts,
      createAssetWithID,
      displayNotification
    } = this.props;
    const { network, accountType, address, path } = this.state;

    const accountNetwork: Network | undefined = getNetworkByName(network);
    if (!accountNetwork) {
      return;
    }
    const newAsset: Asset = getNewDefaultAssetTemplateByNetwork(accountNetwork);
    const newAssetID: string = generateUUID();
    const newUUID = generateUUID();
    const account: Account = {
      address: toChecksumAddress(addHexPrefix(address)),
      network,
      wallet: accountType,
      dPath: path,
      assets: [{ uuid: newAssetID, balance: '0', timestamp: Date.now() }],
      balance: '0',
      transactions: [],
      timestamp: 0,
      favorite: false
    };
    createAccountWithID(account, newUUID);
    updateSettingsAccounts([...settings.dashboardAccounts, newUUID]);
    createAssetWithID(newAsset, newAssetID);

    displayNotification(NotificationTemplates.walletCreated, {
      address: account.address
    });
    history.replace(ROUTE_PATHS.DASHBOARD.path);
  };
}

export default withAccountAndNotificationsContext(CreateMnemonic);
