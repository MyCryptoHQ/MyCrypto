import React, { Component, ReactType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IV3Wallet } from 'ethereumjs-wallet';
import { addHexPrefix, toChecksumAddress } from 'ethereumjs-util';
import pipe from 'ramda/src/pipe';

import { withContext, makeBlob, generateAccountUUID } from '@utils';
import { generateKeystore, fromV3 } from '@workers';
import {
  INetworkContext,
  NetworkContext,
  AssetContext,
  IAssetContext,
  getNewDefaultAssetTemplateByNetwork
} from '@services/Store';
import { stripHexPrefix } from '@services/EthService';
import { WalletFactory } from '@services/WalletService';
import { NotificationTemplates } from '@features/NotificationsPanel';
import { TAddress, IRawAccount, Asset, ISettings, NetworkId, WalletId } from '@types';
import { ROUTE_PATHS, N_FACTOR, DEFAULT_NETWORK } from '@config';

import { KeystoreStages, keystoreStageToComponentHash, keystoreFlow } from './constants';
import { withAccountAndNotificationsContext } from '../components/withAccountAndNotificationsContext';

interface State {
  password: string;
  privateKey: string;
  keystore?: IV3Wallet;
  filename: string;
  network: NetworkId;
  stage: KeystoreStages;
  accountType: WalletId;
}

interface Props extends RouteComponentProps<{}> {
  settings: ISettings;
  createAccountWithID(accountData: IRawAccount, uuid: string): void;
  updateSettingsAccounts(accounts: string[]): void;
  createAssetWithID(value: Asset, id: string): void;
  displayNotification(templateName: string, templateData?: object): void;
}

const WalletService = WalletFactory(WalletId.KEYSTORE_FILE);

class CreateKeystore extends Component<Props & INetworkContext & IAssetContext, State> {
  public state: State = {
    password: '',
    privateKey: '',
    filename: '',
    network: DEFAULT_NETWORK,
    stage: KeystoreStages.GenerateKeystore,
    accountType: WalletId.KEYSTORE_FILE
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

    const { password, privateKey, keystore, filename, network, accountType } = this.state;
    const props = { password, privateKey, keystore, filename, network, accountType };
    return (
      <ActivePanel currentStep={currentStep} totalSteps={totalSteps} {...actions} {...props} />
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
      history.push(ROUTE_PATHS.ROOT.path);
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
    const {
      history,
      settings,
      createAccountWithID,
      updateSettingsAccounts,
      createAssetWithID,
      displayNotification,
      getNetworkById,
      assets
    } = this.props;
    const { keystore, network, accountType } = this.state;

    const accountNetwork = getNetworkById(network);
    if (!keystore || !accountNetwork) {
      return;
    }
    const newAsset = getNewDefaultAssetTemplateByNetwork(assets)(accountNetwork);
    const account: IRawAccount = {
      address: toChecksumAddress(addHexPrefix(keystore.address)) as TAddress,
      networkId: network,
      wallet: accountType,
      dPath: '',
      assets: [{ uuid: newAsset.uuid, balance: '0', mtime: Date.now() }],
      transactions: [],
      favorite: false,
      mtime: 0
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

  private generateWalletAndContinue = async (password: string) => {
    try {
      const res = await generateKeystore(password, N_FACTOR);
      this.setState({
        password,
        keystore: res.keystore,
        filename: res.filename,
        privateKey: stripHexPrefix(res.privateKey)
      });
      this.advanceToNextStage();
    } catch (e) {
      console.error(e);
    }
  };

  private selectNetwork = async (network: NetworkId) => {
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
      WalletService.init(key, password);
      return true;
    } catch (e) {
      return false;
    }
  };
}

export default pipe(
  withAccountAndNotificationsContext,
  withContext(NetworkContext),
  withContext(AssetContext)
)(CreateKeystore);
