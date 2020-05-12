import { IFullWallet } from '../IWallet';
import { IUseWalletConnect } from './types';

export default class WalletConnectWallet implements IFullWallet {
  public address: string;
  private signMessageHandler: IUseWalletConnect['signMessage'];

  constructor(address: string, signMessageHandler: IUseWalletConnect['signMessage']) {
    this.address = address;
    this.signMessageHandler = signMessageHandler;
  }

  public signRawTransaction = () =>
    Promise.reject(new Error('WalletConnect cannot sign raw transaction using this method.'));

  public signMessage = async (msg: string) => this.signMessageHandler(msg, this.address);

  public getAddressString = () => this.address;
}
