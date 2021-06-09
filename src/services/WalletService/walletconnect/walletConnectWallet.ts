import { TAddress } from '@types';

import { IFullWallet } from '../IWallet';
import { IUseWalletConnect } from './types';

export default class WalletConnectWallet implements IFullWallet {
  constructor(
    public address: TAddress,
    private signMessageHandler: IUseWalletConnect['signMessage'],
    private killHandler: IUseWalletConnect['kill']
  ) {}

  public signRawTransaction = () =>
    Promise.reject(new Error('WalletConnect cannot sign raw transaction using this method.'));

  public signMessage = async (msg: string) =>
    this.signMessageHandler({ msg, address: this.address });

  public kill = async () => this.killHandler();

  public getAddressString = () => this.address;
}
