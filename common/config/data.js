// @flow
import { RPCNode } from 'libs/nodes';

export const DONATION_ADDRESSES_MAP = {
  BTC: '1MEWT2SGbqtz6mPCgFcnea8XmWV5Z4Wc6',
  ETH: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  REP: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8'
};

export const donationAddressMap = DONATION_ADDRESSES_MAP;

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

export type NetworkConfig = {
  name: string,
  // unit: string,
  blockExplorer?: {
    name: string,
    tx: string,
    address: string
  },
  tokenExplorer?: {
    name: string,
    address: string
  },
  chainId: number,
  tokens: Token[]
};

export const NETWORKS: { [key: string]: NetworkConfig } = {
  ETH: {
    name: 'ETH',
    // unit: 'ETH',
    chainId: 1,
    blockExplorer: {
      name: 'https://etherscan.io',
      tx: 'https://etherscan.io/tx/[[txHash]]',
      address: 'https://etherscan.io/address/[[address]]'
    },
    tokenExplorer: {
      name: 'Ethplorer.io',
      address: 'https://ethplorer.io/address/[[address]]'
    },
    tokens: require('./tokens/eth').default
    // 'abiList': require('./abiDefinitions/ethAbi.json'),
  }
};

export const NODES = {
  eth_mew: {
    network: 'ETH',
    lib: new RPCNode('https://api.myetherapi.com/eth'),
    service: 'MyEtherWallet',
    estimateGas: true
  }
};
