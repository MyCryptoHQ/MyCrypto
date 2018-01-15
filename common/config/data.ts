import { EtherscanNode, InfuraNode, RPCNode, Web3Node } from 'libs/nodes';
import { networkIdToName } from 'libs/values';
export const languages = require('./languages.json');
// Displays in the header
export const VERSION = '4.0.0 (Alpha 0.1.0)';
export const N_FACTOR = 1024;

// Displays at the top of the site, make message empty string to remove.
// Type can be primary, warning, danger, success, or info.
// HTML is allowed inside of the message.
export const ANNOUNCEMENT_TYPE = 'warning';
export const ANNOUNCEMENT_MESSAGE = `
  This is an Alpha build of MyEtherWallet v4. Please only use for testing,
  or use v3 at <a href='https://myetherwallet.com'>https://myetherwallet.com</a>.
  <br/>
  <span class="hidden-xs">
    If you're interested in recieving updates about the MyEtherWallet V4 Alpha, you can subscribe via
    <a href="http://myetherwallet.us16.list-manage.com/subscribe?u=afced8afb6eb2968ba407a144&id=15a7c74eab">
      mailchimp
    </a>
    :)
  </span>
`;

const etherScan = 'https://etherscan.io';
const blockChainInfo = 'https://blockchain.info';
const ethPlorer = 'https://ethplorer.io';

export const ETHTxExplorer = (txHash: string): string => `${etherScan}/tx/${txHash}`;
export const BTCTxExplorer = (txHash: string): string => `${blockChainInfo}/tx/${txHash}`;
export const ETHAddressExplorer = (address: string): string => `${etherScan}/address/${address}`;
export const ETHTokenExplorer = (address: string): string => `${ethPlorer}/address/${address}`;

export const donationAddressMap = {
  BTC: '1MEWT2SGbqtz6mPCgFcnea8XmWV5Z4Wc6',
  ETH: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  REP: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8'
};

export const gasPriceDefaults = {
  gasPriceMinGwei: 1,
  gasPriceMaxGwei: 60
};

export const MINIMUM_PASSWORD_LENGTH = 9;

export const knowledgeBaseURL = 'https://myetherwallet.github.io/knowledge-base';
export const bityReferralURL = 'https://bity.com/af/jshkb37v';
// Note: add the real referral url once you know it
export const shapeshiftReferralURL = 'https://shapeshift.io';
export const ledgerReferralURL = 'https://www.ledgerwallet.com/r/fa4b?path=/products/';
export const trezorReferralURL = 'https://trezor.io/?a=myetherwallet.com';
export const bitboxReferralURL = 'https://digitalbitbox.com/?ref=mew';

export interface BlockExplorerConfig {
  name: string;
  tx(txHash: string): string;
  address(address: string): string;
}

export interface Token {
  address: string;
  symbol: string;
  decimal: number;
  error?: string | null;
}

export interface NetworkContract {
  name: string;
  address?: string;
  abi: string;
}

export interface NetworkConfig {
  name: string;
  unit: string;
  color?: string;
  blockExplorer?: BlockExplorerConfig;
  tokenExplorer?: {
    name: string;
    address(address: string): string;
  };
  chainId: number;
  tokens: Token[];
  contracts: NetworkContract[] | null;
  isTestnet?: boolean;
}

export interface CustomNetworkConfig {
  name: string;
  unit: string;
  chainId: number;
}

export interface NodeConfig {
  network: string;
  lib: RPCNode | Web3Node;
  service: string;
  estimateGas?: boolean;
  hidden?: boolean;
}

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

// Must be a website that follows the ethplorer convention of /tx/[hash] and
// address/[address] to generate the correct functions.
function makeExplorer(url): BlockExplorerConfig {
  return {
    name: url,
    tx: hash => `${url}/tx/${hash}`,
    address: address => `${url}/address/${address}`
  };
}

export const NETWORKS: { [key: string]: NetworkConfig } = {
  ETH: {
    name: 'ETH',
    unit: 'ETH',
    chainId: 1,
    color: '#0e97c0',
    blockExplorer: makeExplorer('https://etherscan.io'),
    tokenExplorer: {
      name: ethPlorer,
      address: ETHTokenExplorer
    },
    tokens: require('./tokens/eth.json'),
    contracts: require('./contracts/eth.json')
  },
  Ropsten: {
    name: 'Ropsten',
    unit: 'ETH',
    chainId: 3,
    color: '#adc101',
    blockExplorer: makeExplorer('https://ropsten.etherscan.io'),
    tokens: require('./tokens/ropsten.json'),
    contracts: require('./contracts/ropsten.json'),
    isTestnet: true
  },
  Kovan: {
    name: 'Kovan',
    unit: 'ETH',
    chainId: 42,
    color: '#adc101',
    blockExplorer: makeExplorer('https://kovan.etherscan.io'),
    tokens: require('./tokens/ropsten.json'),
    contracts: require('./contracts/ropsten.json'),
    isTestnet: true
  },
  Rinkeby: {
    name: 'Rinkeby',
    unit: 'ETH',
    chainId: 4,
    color: '#adc101',
    blockExplorer: makeExplorer('https://rinkeby.etherscan.io'),
    tokens: require('./tokens/rinkeby.json'),
    contracts: require('./contracts/rinkeby.json'),
    isTestnet: true
  }
};

export const NODES: { [key: string]: NodeConfig } = {
  eth_mew: {
    network: 'ETH',
    lib: new RPCNode('https://api.myetherapi.com/eth'),
    service: 'MyEtherWallet',
    estimateGas: true
  },
  eth_ethscan: {
    network: 'ETH',
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://api.etherscan.io/api'),
    estimateGas: false
  },
  eth_infura: {
    network: 'ETH',
    service: 'infura.io',
    lib: new InfuraNode('https://mainnet.infura.io/mew'),
    estimateGas: false
  },
  rop_mew: {
    network: 'Ropsten',
    service: 'MyEtherWallet',
    lib: new RPCNode('https://api.myetherapi.com/rop'),
    estimateGas: false
  },
  rop_infura: {
    network: 'Ropsten',
    service: 'infura.io',
    lib: new InfuraNode('https://ropsten.infura.io/mew'),
    estimateGas: false
  },
  kov_ethscan: {
    network: 'Kovan',
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://kovan.etherscan.io/api'),
    estimateGas: false
  },
  rin_ethscan: {
    network: 'Rinkeby',
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://rinkeby.etherscan.io/api'),
    estimateGas: false
  },
  rin_infura: {
    network: 'Rinkeby',
    service: 'infura.io',
    lib: new InfuraNode('https://rinkeby.infura.io/mew'),
    estimateGas: false
  }
};

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

export async function initWeb3Node(): Promise<void> {
  const { networkId, lib } = await setupWeb3Node();
  NODES.web3 = {
    network: networkIdToName(networkId),
    service: 'MetaMask / Mist',
    lib,
    estimateGas: false,
    hidden: true
  };
}
