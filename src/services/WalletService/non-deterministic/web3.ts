import { bufferToHex } from 'ethereumjs-util';

import { Web3Node } from '@services/EthService';
import { INode } from '@types';

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

  public async signMessage(msg: string, nodeLib: Web3Node | INode): Promise<string> {
    const msgHex = bufferToHex(Buffer.from(msg));

    if (!nodeLib) {
      throw new Error('');
    }
    /*
    if (!isWeb3Node(nodeLib)) {
      throw new Error('Web3 wallets can only be used with a Web3 node.');
    }*/

    return (nodeLib as Web3Node).signMessage(msgHex, this.address);
  }
}
