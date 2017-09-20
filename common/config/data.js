// @flow
import { RPCNode, InfuraNode, EtherscanNode } from 'libs/nodes';

// Displays in the header
export const VERSION = '4.0.0 (Alpha 0.0.2)';

// Displays at the top of the site, make message empty string to remove.
// Type can be primary, warning, danger, success, or info.
// HTML is allowed inside of the message.
export const ANNOUNCEMENT_TYPE = 'warning';
export const ANNOUNCEMENT_MESSAGE = `
  This is an Alpha build of MyEtherWallet v4. Please only use for testing,
  or use v3 at <a href='https://myetherwallet.com'>https://myetherwallet.com</a>.
  <br/>
  If you're interested in recieving updates about the MyEtherWallet V4 Alpha, you can subscribe via <a href="http://myetherwallet.us16.list-manage.com/subscribe?u=afced8afb6eb2968ba407a144&id=15a7c74eab">mailchimp</a> :)
`;

const etherScan = 'https://etherscan.io';
const blockChainInfo = 'https://blockchain.info';
const ethPlorer = 'https://ethplorer.io';

// TODO: Stop exporting these! Everything should use active node config.
export const ETHTxExplorer = (txHash: string): string =>
  `${etherScan}/tx/${txHash}`;
export const BTCTxExplorer = (txHash: string): string =>
  `${blockChainInfo}/tx/${txHash}`;
export const ETHAddressExplorer = (address: string): string =>
  `${etherScan}/address/${address}`;
export const ETHTokenExplorer = (address: string): string =>
  `${ethPlorer}/address/${address}`;

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

export const languages = [
  {
    sign: 'en',
    name: 'English'
  },
  {
    sign: 'de',
    name: 'Deutsch'
  },
  {
    sign: 'el',
    name: 'Ελληνικά'
  },
  {
    sign: 'es',
    name: 'Español'
  },
  {
    sign: 'fi',
    name: 'Suomi'
  },
  {
    sign: 'fr',
    name: 'Français'
  },
  {
    sign: 'hu',
    name: 'Magyar'
  },
  {
    sign: 'id',
    name: 'Indonesian'
  },
  {
    sign: 'it',
    name: 'Italiano'
  },
  {
    sign: 'ja',
    name: '日本語'
  },
  {
    sign: 'nl',
    name: 'Nederlands'
  },
  {
    sign: 'no',
    name: 'Norsk Bokmål'
  },
  {
    sign: 'pl',
    name: 'Polski'
  },
  {
    sign: 'pt',
    name: 'Português'
  },
  {
    sign: 'ru',
    name: 'Русский'
  },
  {
    sign: 'ko',
    name: 'Korean'
  },
  // {
  //     'sign': 'sk',
  //     'name': 'Slovenčina'
  // },
  // {
  //     'sign': 'sl',
  //     'name': 'Slovenščina'
  // },
  // {
  //     'sign': 'sv',
  //     'name': 'Svenska'
  // },
  {
    sign: 'tr',
    name: 'Türkçe'
  },
  {
    sign: 'vi',
    name: 'Tiếng Việt'
  },
  {
    sign: 'zhcn',
    name: '简体中文'
  },
  {
    sign: 'zhtw',
    name: '繁體中文'
  }
];

export type Token = {
  address: string,
  symbol: string,
  decimal: number
};

export type NetworkContract = {
  name: string,
  address: string,
  abi: string
};

type BlockExplorerConfig = {
  name: string,
  tx: Function,
  address: Function
};

export type NetworkConfig = {
  name: string,
  unit: string,
  color: string,
  blockExplorer?: BlockExplorerConfig,
  tokenExplorer?: {
    name: string,
    address: Function
  },
  chainId: number,
  tokens: Token[],
  contracts: ?Array<NetworkContract>
};

export type NodeConfig = {
  network: string,
  lib: RPCNode,
  service: string,
  estimateGas: ?boolean
};

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
