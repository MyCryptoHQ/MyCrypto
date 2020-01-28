import { IFullWallet } from '../IWallet';

export default class WalletConnectWallet implements IFullWallet {
  public address: string;

  constructor(address: string) {
    this.address = address;
  }

  public signRawTransaction = () =>
    Promise.reject(new Error('WalletConnect cannot sign raw transaction using this method.'));

  public signMessage = () => Promise.reject(new Error('WalletConnect cannot sign messages.'));

  public getAddressString() {
    return this.address;
  }
}
