// @flow
import { RPCNode } from 'libs/nodes';

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

export type NetworkConfig = {
  name: string,
  unit: string,
  blockExplorer?: {
    name: string,
    tx: Function,
    address: Function
  },
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

export const NETWORKS: { [key: string]: NetworkConfig } = {
  ETH: {
    name: 'ETH',
    unit: 'ETH',
    chainId: 1,
    blockExplorer: {
      name: etherScan,
      tx: ETHTxExplorer,
      address: ETHAddressExplorer
    },
    tokenExplorer: {
      name: ethPlorer,
      address: ETHTokenExplorer
    },
    tokens: require('./tokens/eth').default,
    contracts: require('./contracts/eth.json')
  }
};

export const NODES: { [key: string]: NodeConfig } = {
  eth_mew: {
    network: 'ETH',
    lib: new RPCNode('https://api.myetherapi.com/eth'),
    service: 'MyEtherWallet',
    estimateGas: true
  }
};
