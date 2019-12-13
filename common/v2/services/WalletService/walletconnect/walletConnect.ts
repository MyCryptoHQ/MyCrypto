import WalletConnect from '@walletconnect/browser';
import { WalletConnectSingleton } from '../walletconnect/walletConnectSingleton';
import { ITxData } from '@walletconnect/types';

export default class WalletConnectService {
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
    return this.walletConnector ? this.walletConnector.accounts : undefined;
  }

  public getWalletConnector() {
    return this.walletConnector;
  }

  public getWalletConnectorUri() {
    return this.walletConnector!.uri || undefined;
  }

  public signTransaction(tx: ITxData) {
    return this.walletConnector!.signTransaction(tx);
  }

  public sendTransaction(tx: ITxData) {
    return this.walletConnector!.sendTransaction(tx);
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
