import RPCNode, { errorOrResult } from '../rpc';
import Web3Client from './client';
import Web3Requests from './requests';
import { Web3Transaction } from './types';
import { INode } from 'libs/nodes/INode';

export default class Web3Node extends RPCNode {
  public client: Web3Client;
  public requests: Web3Requests;

  constructor() {
    super('web3'); // initialized with fake endpoint
    this.client = new Web3Client();
    this.requests = new Web3Requests();
  }

  public getNetworkId(): Promise<string> {
    return this.client.call(this.requests.getNetworkId()).then(errorOrResult);
  }

  public sendTransaction(web3Tx: Web3Transaction): Promise<string> {
    return this.client
      .call(this.requests.sendTransaction(web3Tx))
      .then(errorOrResult);
  }

  public signMessage(msgHex: string, fromAddr: string): Promise<string> {
    return this.client
      .call(this.requests.signMessage(msgHex, fromAddr))
      .then(errorOrResult);
  }

  public getAccounts(): Promise<string> {
    return this.client.call(this.requests.getAccounts()).then(errorOrResult);
  }
}

export function isWeb3Node(nodeLib: INode | Web3Node): nodeLib is Web3Node {
  return nodeLib instanceof Web3Node;
}
