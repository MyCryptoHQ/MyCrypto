import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { IFullWallet } from '../IWallet';
import { bufferToHex, toChecksumAddress } from 'ethereumjs-util';
import { configuredStore } from 'store';
import { getNodeLib, getNetworkByChainId } from 'selectors/config';
import Web3Node from 'libs/nodes/web3';
import { INode } from 'libs/nodes/INode';

export default class Web3Wallet implements IFullWallet {
  private address: string;
  private network: string;

  constructor(address: string, network: string) {
    this.address = address;
    this.network = network;
  }

  public getAddressString(): string {
    return toChecksumAddress(this.address);
  }

  public signRawTransaction(): Promise<Buffer> {
    return Promise.reject(new Error('Web3 wallets cannot sign raw transactions.'));
  }

  public async signMessage(msg: string): Promise<string> {
    const msgHex = bufferToHex(Buffer.from(msg));
    const state = configuredStore.getState();
    const nodeLib: Web3Node | INode = getNodeLib(state);

    if (!nodeLib) {
      throw new Error('');
    }
    /*
    if (!isWeb3Node(nodeLib)) {
      throw new Error('Web3 wallets can only be used with a Web3 node.');
    }*/

    return (nodeLib as Web3Node).signMessage(msgHex, this.address);
  }

  public async sendTransaction(serializedTransaction: string): Promise<string> {
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

    const state = configuredStore.getState();
    const nodeLib: Web3Node = getNodeLib(state) as any;

    if (!nodeLib) {
      throw new Error('');
    }

    /*
    if (!isWeb3Node(nodeLib)) {
      throw new Error('Web3 wallets can only be used with a Web3 node.');
    }*/
    await this.networkCheck(nodeLib);

    return nodeLib.sendTransaction(web3Tx);
  }

  private async networkCheck(lib: Web3Node) {
    const netId = await lib.getNetVersion();
    const networkConfig = getNetworkByChainId(configuredStore.getState(), netId);
    if (!networkConfig) {
      throw new Error(`MyCrypto doesn’t support the network with chain ID '${netId}'`);
    } else if (this.network !== networkConfig.id) {
      throw new Error(
        `Expected MetaMask / Mist network to be ${this.network}, but got ${
          networkConfig.id
        }. Please change the network or refresh the page.`
      );
    }
  }
}
