import { IHexStrWeb3Transaction } from 'libs/transaction';
import RPCNode from '../rpc';
import Web3Client from './client';
import Web3Requests from './requests';
import { INode } from 'libs/nodes/INode';

import {
  isValidSendTransaction,
  isValidSignMessage,
  isValidGetAccounts,
  isValidGetNetVersion
} from 'libs/validators';

export default class Web3Node extends RPCNode {
  public client: Web3Client;
  public requests: Web3Requests;

  constructor() {
    super('web3'); // initialized with fake endpoint
    this.client = new Web3Client();
    this.requests = new Web3Requests();
  }

  public getNetVersion(): Promise<string> {
    return this.client
      .call(this.requests.getNetVersion())
      .then(isValidGetNetVersion)
      .then(({ result }) => result);
  }

  public sendTransaction(web3Tx: IHexStrWeb3Transaction): Promise<string> {
    return this.client
      .call(this.requests.sendTransaction(web3Tx))
      .then(isValidSendTransaction)
      .then(({ result }) => result);
  }

  public signMessage(msgHex: string, fromAddr: string): Promise<string> {
    return this.client
      .call(this.requests.signMessage(msgHex, fromAddr))
      .then(isValidSignMessage)
      .then(({ result }) => result);
  }

  public getAccounts(): Promise<string> {
    return this.client
      .call(this.requests.getAccounts())
      .then(isValidGetAccounts)
      .then(({ result }) => result);
  }
}

export function isWeb3Node(nodeLib: INode | Web3Node): nodeLib is Web3Node {
  return nodeLib instanceof Web3Node;
}

export const Web3Service = 'MetaMask / Mist';

export async function setupWeb3Node() {
  const { web3 } = window as any;

  if (!web3 || !web3.currentProvider || !web3.currentProvider.sendAsync) {
    throw new Error('Web3 not found. Please check that MetaMask is installed');
  }

  const lib = new Web3Node();
  const networkId = await lib.getNetVersion();
  const accounts = await lib.getAccounts();

  if (!accounts.length) {
    throw new Error('No accounts found in MetaMask / Mist.');
  }

  if (networkId === 'loading') {
    throw new Error('MetaMask / Mist is still loading. Please refresh the page and try again.');
  }

  return { networkId, lib };
}

export async function isWeb3NodeAvailable(): Promise<boolean> {
  try {
    await setupWeb3Node();
    return true;
  } catch (e) {
    return false;
  }
}
