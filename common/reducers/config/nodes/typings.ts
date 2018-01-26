import { RPCNode, Web3Node } from 'libs/nodes';
import { networkIdToName } from 'libs/values';
import { DefaultNetworkNames } from 'reducers/config/networks/typings';

export interface CustomNodeConfig {
  name: string;
  url: string;
  port: number;
  network: string;
  auth?: {
    username: string;
    password: string;
  };
}

export interface DefaultNodeConfig {
  networkName: DefaultNetworkNames;
  lib: RPCNode | Web3Node;
  service: string;
  estimateGas?: boolean;
  hidden?: boolean;
}

export enum DefaultNodeName {
  ETH_MEW = 'eth_mew',
  ETH_MYCRYPTO = 'eth_mycrypto',
  ETH_ETHSCAN = 'eth_ethscan',
  ETH_INFURA = 'eth_infura',
  ROP_MEW = 'rop_mew',
  ROP_INFURA = 'rop_infura',
  KOV_ETHSCAN = 'kov_ethscan',
  RIN_ETHSCAN = 'rin_ethscan',
  RIN_INFURA = 'rin_infura',
  ETC_EPOOL = 'etc_epool',
  UBQ = 'ubq',
  EXP_TECH = 'exp_tech'
}

export type NonWeb3NodeConfigs = { [key in DefaultNodeName]: DefaultNodeConfig };

export interface Web3NodeConfig {
  web3?: DefaultNodeConfig;
}

/**
 * TODO: Put this in a saga that runs on app mount
 */
interface Web3NodeInfo {
  networkId: string;
  lib: Web3Node;
}

export async function setupWeb3Node(): Promise<Web3NodeInfo> {
  const { web3 } = window as any;

  if (!web3 || !web3.currentProvider || !web3.currentProvider.sendAsync) {
    throw new Error(
      'Web3 not found. Please check that MetaMask is installed, or that MyEtherWallet is open in Mist.'
    );
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

export const Web3Service = 'MetaMask / Mist';

export interface NodeConfigOverride extends DefaultNodeConfig {
  networkName: any;
}

export async function initWeb3Node(): Promise<void> {
  const { networkId, lib } = await setupWeb3Node();
  const web3: NodeConfigOverride = {
    network: networkIdToName(networkId),
    service: Web3Service,
    lib,
    estimateGas: false,
    hidden: true
  };

  NODES.web3 = web3;
}
