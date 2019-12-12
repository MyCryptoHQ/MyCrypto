import WalletConnect from '@walletconnect/browser';
import { ITxObject } from 'v2/types';
import { WalletConnectSingleton } from '../walletconnect/walletConnectSingleton';

export default class WalletConnectItem {
  private walletConnector: WalletConnect | undefined;
  private isInitializing = false;

  constructor() {
    this.fetchWalletConnectSession();
  }

  public getAddressString() {
    // ToDo: Swap this to be the relevant account, not all accounts
    return this.walletConnector!.accounts[0];
  }

  public getAllAccounts() {
    // ToDo: Swap this to be the relevant account, not all accounts
    return this.walletConnector!.accounts;
  }

  public getWalletConnector() {
    return this.walletConnector;
  }

  public getWalletConnectorUri() {
    return this.walletConnector!.uri || undefined;
  }

  public signRawTransaction(tx: ITxObject) {
    return this.walletConnector!.signTransaction({
      from: this.walletConnector!.accounts[0],
      ...tx
    });
  }

  public async signMessage() {
    return '';
  }

  public async killSession() {
    WalletConnectSingleton.refreshWalletConnectSession();
    this.isInitializing = false;
    this.walletConnector = undefined;
  }

  private async fetchWalletConnectSession(): Promise<WalletConnect> {
    if (!this.walletConnector && !this.isInitializing) {
      this.isInitializing = true;
      this.walletConnector = await WalletConnectSingleton.getWalletConnectSession();
    }
    return this.walletConnector!;
  }
}
