import { EtherscanNode, InfuraNode, RPCNode, Web3Node } from 'libs/nodes';
import { networkIdToName } from 'libs/values';
export const languages = require('./languages.json');
// Displays in the header
export const VERSION = '4.0.0 (Alpha 0.0.5)';
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

export const bityReferralURL = 'https://bity.com/af/jshkb37v';
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
  address: string;
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
  ETC: {
    name: 'ETC',
    unit: 'ETC',
    chainId: 61,
    color: '#669073',
    blockExplorer: makeExplorer('https://gastracker.io'),
    tokens: require('./tokens/etc.json'),
    contracts: require('./contracts/etc.json')
  },
  Ropsten: {
    name: 'Ropsten',
    unit: 'ETH',
    chainId: 3,
    color: '#adc101',
    blockExplorer: makeExplorer('https://ropsten.etherscan.io'),
    tokens: require('./tokens/ropsten.json'),
    contracts: require('./contracts/ropsten.json')
  },
  Kovan: {
    name: 'Kovan',
    unit: 'ETH',
    chainId: 42,
    color: '#adc101',
    blockExplorer: makeExplorer('https://kovan.etherscan.io'),
    tokens: require('./tokens/ropsten.json'),
    contracts: require('./contracts/ropsten.json')
  },
  Rinkeby: {
    name: 'Rinkeby',
    unit: 'ETH',
    chainId: 4,
    color: '#adc101',
    blockExplorer: makeExplorer('https://rinkeby.etherscan.io'),
    tokens: require('./tokens/rinkeby.json'),
    contracts: require('./contracts/rinkeby.json')
  },
  RSK: {
    name: 'RSK',
    unit: 'RSK',
    chainId: 31,
    color: '#ff794f',
    blockExplorer: makeExplorer('https://explorer.rsk.co'),
    tokens: require('./tokens/rsk.json'),
    contracts: require('./contracts/rsk.json')
  },
  EXP: {
    name: 'EXP',
    unit: 'EXP',
    chainId: 2,
    color: '#673ab7',
    blockExplorer: makeExplorer('http://www.gander.tech'),
    tokens: require('./tokens/exp.json'),
    contracts: require('./contracts/exp.json')
  },
  UBQ: {
    name: 'UBQ',
    unit: 'UBQ',
    chainId: 8,
    color: '#b37aff',
    blockExplorer: makeExplorer('https://ubiqscan.io/en'),
    tokens: require('./tokens/ubq.json'),
    contracts: require('./contracts/ubq.json')
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
  etc_epool: {
    network: 'ETC',
    service: 'Epool.io',
    lib: new RPCNode('https://mewapi.epool.io'),
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
  },
  rsk: {
    network: 'RSK',
    service: 'GK2.sk',
    lib: new RPCNode('https://rsk-test.gk2.sk/'),
    estimateGas: true
  },
  exp: {
    network: 'EXP',
    service: 'Expanse.tech',
    lib: new RPCNode('https://node.expanse.tech/'),
    estimateGas: true
  },
  ubq: {
    network: 'UBQ',
    service: 'ubiqscan.io',
    lib: new RPCNode('https://pyrus2.ubiqscan.io'),
    estimateGas: true
  }
};

export async function initWeb3Node(): Promise<void> {
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

  NODES.web3 = {
    network: networkIdToName(networkId),
    service: 'MetaMask / Mist',
    lib,
    estimateGas: false,
    hidden: true
  };
}
