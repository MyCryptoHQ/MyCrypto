import React, { Component, ReactType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IV3Wallet } from 'ethereumjs-wallet';
import { addHexPrefix, toChecksumAddress } from 'ethereumjs-util';

import { makeBlob } from 'utils/blob';
import { N_FACTOR } from 'config';
import { generateKeystore, fromV3 } from 'v2/workers';
import { getNewDefaultAssetTemplateByNetwork, getNetworkByName } from 'v2/services/Store';
import { stripHexPrefix } from 'v2/services/EthService';
import { WalletFactory } from 'v2/services/WalletService';
import { NotificationTemplates } from 'v2/features/NotificationsPanel';
import { Account, Asset, ISettings, Network, NetworkId, WalletId } from 'v2/types';
import { generateUUID } from 'v2/utils';
import { ROUTE_PATHS } from 'v2/config';

import { KeystoreStages, keystoreStageToComponentHash, keystoreFlow } from './constants';
import { withAccountAndNotificationsContext } from '../components/withAccountAndNotificationsContext';

interface State {
  password: string;
  privateKey: string;
  keystore?: IV3Wallet;
  filename: string;
  network: string;
  stage: KeystoreStages;
  accountType: WalletId;
}

interface Props extends RouteComponentProps<{}> {
  settings: ISettings;
  createAccountWithID(accountData: Account, uuid: string): void;
  updateSettingsAccounts(accounts: string[]): void;
  createAssetWithID(value: Asset, id: string): void;
  displayNotification(templateName: string, templateData?: object): void;
}

const WalletService = WalletFactory(WalletId.KEYSTORE_FILE);

class CreateKeystore extends Component<Props, State> {
  public state: State = {
    password: '',
    privateKey: '',
    filename: '',
    network: '',
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
      displayNotification
    } = this.props;
    const { keystore, network, accountType } = this.state;

    const accountNetwork: Network | undefined = getNetworkByName(network);
    if (!keystore || !accountNetwork) {
      return;
    }
    const newAsset: Asset = getNewDefaultAssetTemplateByNetwork(accountNetwork);
    const newAssetID: string = generateUUID();
    const newUUID = generateUUID();
    const account: Account = {
      address: toChecksumAddress(addHexPrefix(keystore.address)),
      networkId: network as NetworkId,
      wallet: accountType,
      dPath: '',
      assets: [{ uuid: newAssetID, balance: '0', mtime: Date.now() }],
      transactions: [],
      favorite: false,
      mtime: 0
    };
    createAccountWithID(account, newUUID);
    updateSettingsAccounts([...settings.dashboardAccounts, newUUID]);
    createAssetWithID(newAsset, newAssetID);

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
      WalletService.init(key, password);
      return true;
    } catch (e) {
      return false;
    }
  };
}

export default withAccountAndNotificationsContext(CreateKeystore);
