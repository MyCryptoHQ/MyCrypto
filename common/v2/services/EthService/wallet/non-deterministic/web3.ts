import { bufferToHex } from 'ethereumjs-util';

import { Web3Node, getTransactionFields, makeTransaction } from 'v2/services/EthService';
import { INode } from 'v2/types';
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

  public async sendTransaction(
    serializedTransaction: string,
    nodeLib: Web3Node,
    networkConfig: any
  ): Promise<string> {
    const transactionInstance = makeTransaction(serializedTransaction);
    const { to, value, gasLimit: gas, gasPrice, data, nonce, chainId } = getTransactionFields(
      transactionInstance
    );
    const from = this.address;
    const web3Tx = {
      from,
      to,
      value,
      gas,
      gasPrice,
      data,
      nonce,
      chainId
    };

    if (!nodeLib) {
      throw new Error('');
    }

    /*
    if (!isWeb3Node(nodeLib)) {
      throw new Error('Web3 wallets can only be used with a Web3 node.');
    }*/
    await this.networkCheck(nodeLib, networkConfig);

    return nodeLib.sendTransaction(web3Tx);
  }

  private async networkCheck(lib: Web3Node, networkConfig: any) {
    const netId = await lib.getNetVersion();
    // const networkConfig = getNetworkByChainId(configuredStore.getState(), netId);

    if (!networkConfig) {
      throw new Error(`MyCrypto doesn’t support the network with chain ID '${netId}'`);
    } else if (this.network !== networkConfig.id) {
      throw new Error(
        `Expected MetaMask / Web3 network to be ${this.network}, but got ${
          networkConfig.id
        }. Please change the network or refresh the page.`
      );
    }
  }
}
