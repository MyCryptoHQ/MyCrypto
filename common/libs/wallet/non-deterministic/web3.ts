import { IWallet } from '../IWallet';
import { ExtendedRawTransaction } from 'libs/transaction';
import { networkIdToName, sanitizeHex } from 'libs/values';
import { bufferToHex } from 'ethereumjs-util';
import { configuredStore } from 'store';
import { getNodeLib } from 'selectors/config';
import Web3Node, { isWeb3Node } from 'libs/nodes/web3';
import { INode } from 'libs/nodes/INode';
import BN from 'bn.js';

export default class Web3Wallet implements IWallet {
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

  // public signMessage(msg: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const msgHex = bufferToHex(Buffer.from(msg));
  //     const options = {
  //       method: 'personal_sign',
  //       params: [msgHex, this.address],
  //       signingAddr: this.address
  //     };

  //     this.web3.currentProvider.sendAsync(options, (err, data) => {
  //       if (err) {
  //         return reject(err);
  //       }

  //       if (data.error) {
  //         return reject(data.error);
  //       }
  //       resolve(data.result);
  //     });
  //   });
  // }

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

  // public sendTransaction(transaction: ExtendedRawTransaction): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const { from, to, value, gasLimit, gasPrice, data, nonce } = transaction;

  //     const web3Tx = {
  //       from,
  //       to,
  //       value,
  //       gas: gasLimit,
  //       gasPrice,
  //       data,
  //       nonce
  //     };

  //     // perform sanity check to ensure network hasn't changed
  //     this.web3.version.getNetwork((err1, networkId) => {
  //       const networkName = networkIdToName(networkId);

  //       if (err1) {
  //         return reject(err1);
  //       }

  //       if (this.network !== networkName) {
  //         return reject(
  //           new Error(
  //             `Expected MetaMask / Mist network to be ${
  //               this.network
  //             }, but got ${networkName}. ` +
  //               `Please change the network or restart MyEtherWallet.`
  //           )
  //         );
  //       }

  //       // execute transaction
  //       this.web3.eth.sendTransaction(web3Tx, (err2, txHash) => {
  //         if (err2) {
  //           return reject(err2);
  //         }
  //         resolve(txHash);
  //       });
  //     });
  //   });
  // }

  // private nodeCheck(nodeLib: Web3Node | INode) {
  //   if (!this.isWeb3Node(nodeLib)) {
  //     throw new Error('Expected node type to be Web3.')
  //   }
  // }

  private async networkCheck(lib: Web3Node) {
    const netId = await lib.getNetworkId();
    const netName = networkIdToName(netId);
    if (this.network !== netName) {
      throw new Error(
        `Expected MetaMask / Mist network to be ${this.network}, but got ${
          netName
        }. ` + `Please change the network or restart MyEtherWallet.`
      );
    }
  }
}
