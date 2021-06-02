import { getChainIdAndLib, requestAccounts } from '@services/EthService/web3';

import { IFullWallet } from '../IWallet';

export default class Web3Wallet implements IFullWallet {
  public network: string;

  private address: string;

  constructor(address: string, network: string) {
    this.address = address;
    this.network = network;
  }

  public getAddressString(): string {
    return this.address;
  }

  public signRawTransaction(): Promise<Buffer> {
    return Promise.reject(new Error('Web3 wallets cannot sign raw transactions.'));
  }

  public async signMessage(msg: string): Promise<string> {
    const { lib: web3 } = await getChainIdAndLib();

    if (!web3) {
      throw new Error('');
    }

    return requestAccounts(web3).then(() => web3.getSigner(this.address).signMessage(msg));
  }
}
