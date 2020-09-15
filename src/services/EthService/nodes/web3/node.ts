import {
  isValidGetAccounts,
  isValidGetNetVersion,
  isValidSendTransaction,
  isValidSignMessage
} from '@services/EthService';
import { isValidRequestPermissions } from '@services/EthService/validators';
import { translateRaw } from '@translations';
import {
  IExposedAccountsPermission,
  IHexStrWeb3Transaction,
  INode,
  IWeb3Permission,
  TAddress,
  Web3RequestPermissionsResult
} from '@types';

import { RPCNode } from '../rpc';
import Web3Client from './client';
import Web3Requests from './requests';

export class Web3Node extends RPCNode {
  // @ts-ignore
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

  public getAccounts(): Promise<TAddress[] | undefined> {
    return this.client
      .call(this.requests.getAccounts())
      .then(isValidGetAccounts)
      .then(({ result }) => result && result.length > 0 && result)
      .catch(undefined);
  }

  public requestPermissions(): Promise<Web3RequestPermissionsResult[]> {
    return this.client
      .callWeb3(this.requests.requestPermissions())
      .then(isValidRequestPermissions)
      .then(({ result }) => result);
  }

  public getApprovedAccounts(): Promise<TAddress[] | undefined> {
    return this.client
      .callWeb3(this.requests.getPermissions())
      .then(isValidRequestPermissions)
      .then(({ result }) => result && result[0] && result[0].caveats)
      .then((permissions: IWeb3Permission[] | undefined) => deriveApprovedAccounts(permissions));
  }
}

export function isWeb3Node(nodeLib: INode | Web3Node): nodeLib is Web3Node {
  return nodeLib instanceof Web3Node;
}

export async function getChainIdAndLib() {
  const lib = new Web3Node();
  const chainId = await lib.getNetVersion();
  const accounts = await lib.getAccounts();
  if (!accounts || !accounts.length) {
    throw new Error('No accounts found in MetaMask / Web3.');
  }

  if (chainId === 'loading') {
    throw new Error('MetaMask / Web3 is still loading. Please refresh the page and try again.');
  }

  return { chainId, lib };
}

export async function setupWeb3Node() {
  // Handle the following MetaMask breaking change:
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  const { ethereum } = window as any;
  if (ethereum) {
    // Overwrite the legacy Web3 with the newer version.
    if ((window as any).Web3) {
      (window as any).web3 = new (window as any).Web3(ethereum);
    }
    const web3Node = new Web3Node();
    const permissions = await requestPermission(web3Node);
    if (permissions) {
      return await getChainIdAndLib();
    }
    const legacyConnect = await requestLegacyConnect(ethereum);
    if (legacyConnect) {
      return await getChainIdAndLib();
    }
    throw new Error(translateRaw('METAMASK_PERMISSION_DENIED'));
  } else if ((window as any).web3) {
    // Legacy handling; will become unavailable 11/2.
    const { web3 } = window as any;

    if (!web3 || !web3.currentProvider || !web3.currentProvider.sendAsync) {
      throw new Error('Web3 not found. Please check that MetaMask is installed');
    }

    return getChainIdAndLib();
  } else {
    throw new Error('Web3 not found. Please check that MetaMask is installed');
  }
}

const requestPermission = async (web3Node: Web3Node) => {
  try {
    return await web3Node.requestPermissions();
  } catch (e) {
    console.debug('[requestPermission]: ', e);
    return;
  }
};

const requestLegacyConnect = async (ethereum: any) => {
  try {
    await ethereum.enable();
    return true;
  } catch (e) {
    console.debug('[requestLegacyConnect]: ', e);
    return;
  }
};

const deriveApprovedAccounts = (walletPermissions: IWeb3Permission[] | undefined) => {
  if (!walletPermissions) return;
  const exposedAccounts = walletPermissions.find(
    (caveat: any) => caveat.name === 'exposedAccounts'
  ) as IExposedAccountsPermission | undefined;
  return exposedAccounts && exposedAccounts.value;
};
