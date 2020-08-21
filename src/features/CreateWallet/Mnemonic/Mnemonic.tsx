import React, { Component, ReactType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { addHexPrefix, toChecksumAddress, privateToAddress } from 'ethereumjs-util';
import HDkey from 'hdkey';
import uniq from 'lodash/uniq';
import pipe from 'ramda/src/pipe';

import { MnemonicStages, mnemonicStageToComponentHash, mnemonicFlow } from './constants';
import { withAccountAndNotificationsContext } from '../components/withAccountAndNotificationsContext';
import { NotificationTemplates } from '@features/NotificationsPanel';
import { TAddress, IRawAccount, Asset, DPathFormat, ISettings, WalletId, NetworkId } from '@types';
import { withContext, generateAccountUUID, withHook } from '@utils';
import {
  NetworkContext,
  IAssetContext,
  INetworkContext,
  getNewDefaultAssetTemplateByNetwork,
  useAssets
} from '@services/Store';
import { DEFAULT_NETWORK, ROUTE_PATHS } from '@config';

interface Props extends RouteComponentProps<{}> {
  settings: ISettings;
  createAccountWithID(accountData: IRawAccount, uuid: string): void;
  updateSettingsAccounts(accounts: string[]): void;
  createAssetWithID(value: Asset, id: string): void;
  displayNotification(templateName: string, templateData?: object): void;
}

interface State {
  network: NetworkId;
  stage: MnemonicStages;
  words: string[];
  accountType: DPathFormat;
  dPath: string;
  address: string;
}

class CreateMnemonic extends Component<Props & IAssetContext & INetworkContext> {
  public state: State = {
    stage: MnemonicStages.SelectNetwork,
    words: [],
    network: DEFAULT_NETWORK,
    accountType: WalletId.MNEMONIC_PHRASE,
    dPath: this.props.getNetworkById(DEFAULT_NETWORK).dPaths[WalletId.MNEMONIC_PHRASE]?.value || '',
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

    const { words, network, accountType, dPath, address } = this.state;
    const props = { words, network, accountType, dPath, address };

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

  private selectNetwork = async (network: NetworkId) => {
    const accountNetwork = this.props.getNetworkById(network);
    const pathFormat = accountNetwork && accountNetwork.dPaths[this.state.accountType];
    const path = (pathFormat && pathFormat.value) || '';
    this.setState({ network, path });
  };

  private decryptMnemonic = () => {
    const { words, dPath } = this.state;

    const phrase = words.join(' ').trim();
    const seed = mnemonicToSeedSync(phrase);
    const derived = HDkey.fromMasterSeed(seed).derive(dPath);
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
      displayNotification,
      getNetworkById
    } = this.props;
    const { network, accountType, address, dPath } = this.state;

    const accountNetwork = getNetworkById(network);
    if (!accountNetwork) return;

    const newAsset = getNewDefaultAssetTemplateByNetwork(this.props.assets)(accountNetwork);
    const account: IRawAccount = {
      address: toChecksumAddress(addHexPrefix(address)) as TAddress,
      networkId: network,
      wallet: accountType,
      dPath,
      assets: [{ uuid: newAsset.uuid, balance: '0', mtime: Date.now() }],
      transactions: [],
      favorite: false,
      mtime: Date.now()
    };
    const accountUUID = generateAccountUUID(network, account.address);
    createAccountWithID(account, accountUUID);
    updateSettingsAccounts([...settings.dashboardAccounts, accountUUID]);
    createAssetWithID(newAsset, newAsset.uuid);

    displayNotification(NotificationTemplates.walletCreated, {
      address: account.address
    });
    history.replace(ROUTE_PATHS.DASHBOARD.path);
  };
}

export default pipe(
  withAccountAndNotificationsContext,
  withHook(useAssets),
  withContext(NetworkContext)
)(CreateMnemonic);
