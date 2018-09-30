import { translateRaw } from 'translations';
import { IHexStrWeb3Transaction } from 'libs/transaction';
import { INode } from 'libs/nodes/INode';
import {
  isValidSendTransaction,
  isValidSignMessage,
  isValidGetAccounts,
  isValidGetNetVersion
} from 'libs/validators';
import RPCNode from '../rpc';
import Web3Client from './client';
import Web3Requests from './requests';

const METAMASK_PERMISSION_DENIED_ERROR = translateRaw('METAMASK_PERMISSION_DENIED');

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
  // Handle the following MetaMask breaking change:
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  if (window.ethereum) {
    // Overwrite the legacy Web3 with the newer version.
    window.web3 = new Web3(window.ethereum);

    try {
      // Request permission to access MetaMask accounts.
      await window.ethereum.enable();

      const lib = new Web3Node();
      const chainId = await lib.getNetVersion();
      const accounts = await lib.getAccounts();

      if (!accounts.length) {
        throw new Error('No accounts found in MetaMask / Mist.');
      }

      if (chainId === 'loading') {
        throw new Error('MetaMask / Mist is still loading. Please refresh the page and try again.');
      }

      return { chainId, lib };

      // Permission was granted; proceed.
    } catch (e) {
      // Permission was denied; handle appropriately.
      throw new Error(METAMASK_PERMISSION_DENIED_ERROR);
    }
  } else if (window.web3) {
    // Legacy handling; will become unavailable 11/2.
  } else {
    throw new Error('Web3 not found. Please check that MetaMask is installed');
  }
}

export async function isWeb3NodeAvailable(): Promise<boolean> {
  try {
    await setupWeb3Node();
    return true;
  } catch (e) {
    // If the specific error is that the request for MetaMask permission was denied,
    // re-throw the error and allow the caller to handle it.
    if (e.message === METAMASK_PERMISSION_DENIED_ERROR) {
      throw e;
    }

    // Otherwise, chances are the MetaMask extension isn't installed.
    return false;
  }
}
