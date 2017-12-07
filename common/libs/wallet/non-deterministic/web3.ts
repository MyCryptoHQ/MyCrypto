import { IFullWallet } from '../IWallet';
import { ExtendedRawTransaction } from 'libs/transaction';
import { networkIdToName, sanitizeHex } from 'libs/values';
import { bufferToHex } from 'ethereumjs-util';
import { configuredStore } from 'store';
import { getNodeLib } from 'selectors/config';
import Web3Node, { isWeb3Node } from 'libs/nodes/web3';
import { INode } from 'libs/nodes/INode';
import BN from 'bn.js';

export default class Web3Wallet implements IFullWallet {
  private address: string;
  private network: string;

  constructor(address: string, network: string) {
    this.address = address;
    this.network = network;
  }

  public getAddressString(): Promise<string> {
    return Promise.resolve(this.address);
  }

  public signRawTransaction(): Promise<string> {
    return Promise.reject(
      new Error('Web3 wallets cannot sign raw transactions.')
    );
  }

  public async signMessage(msg: string): Promise<string> {
    const msgHex = bufferToHex(Buffer.from(msg));
    const state = configuredStore.getState();
    const nodeLib: Web3Node | INode = getNodeLib(state);

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Web3 wallets can only be used with a Web3 node.');
    }

    return nodeLib.signMessage(msgHex, this.address);
  }

  public async sendTransaction(
    transaction: ExtendedRawTransaction
  ): Promise<string> {
    const state = configuredStore.getState();
    const nodeLib: Web3Node | INode = getNodeLib(state);
    const { from, to, value, gasLimit, gasPrice, data, nonce } = transaction;
    const web3Tx = {
      from,
      to,
      value,
      gas:
        gasLimit instanceof BN ? sanitizeHex(gasLimit.toString(16)) : gasLimit,
      gasPrice:
        gasPrice instanceof BN ? sanitizeHex(gasPrice.toString(16)) : gasPrice,
      data,
      nonce
    };

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Web3 wallets can only be used with a Web3 node.');
    }
    await this.networkCheck(nodeLib);

    return nodeLib.sendTransaction(web3Tx);
  }

  private async networkCheck(lib: Web3Node) {
    const netId = await lib.getNetVersion();
    const netName = networkIdToName(netId);
    if (this.network !== netName) {
      throw new Error(
        `Expected MetaMask / Mist network to be ${this.network}, but got ${
          netName
        }. Please change the network or restart MyEtherWallet.`
      );
    }
  }
}
