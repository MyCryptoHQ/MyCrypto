// @flow
import { RPCNode } from 'libs/nodes';

export const DONATION_ADDRESSES_MAP = {
  BTC: '1MEWT2SGbqtz6mPCgFcnea8XmWV5Z4Wc6',
  ETH: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  REP: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8'
};

export const donationAddressMap = DONATION_ADDRESSES_MAP;

export const errorMsgs = [
  'Please enter a valid amount.', // 0
  'Your password must be at least 9 characters. Please ensure it is a strong password. ', // 1
  "Sorry! We don't recognize this type of wallet file. ", // 2
  'This is not a valid wallet file. ', // 3
  "This unit doesn't exists, please use the one of the following units ", // 4
  'Please enter a valid address. ', // 5
  'Please enter a valid password. ', // 6
  'Please enter valid decimals (Must be integer, 0-18). ', // 7
  'Please enter a valid gas limit (Must be integer. Try 21000-4000000). ', // 8
  'Please enter a valid data value (Must be hex). ', // 9
  'Please enter a valid gas price. ', // 10 - NOT USED
  'Please enter a valid nonce (Must be integer).', // 11
  'Invalid signed transaction. ', // 12
  'A wallet with this nickname already exists. ', // 13
  'Wallet not found. ', // 14
  "Whoops. It doesn't look like a proposal with this ID exists yet or there is an error reading this proposal. ", // 15 - NOT USED
  'A wallet with this address already exists in storage. Please check your wallets page. ', // 16
  'Insufficient funds. Account you try to send transaction from does not have enough funds. Required {} wei and got: {} wei. If sending tokens, you must have 0.01 ETH in your account to cover the cost of gas. ', // 17
  'All gas would be used on this transaction. This means you have already voted on this proposal or the debate period has ended.', // 18
  'Please enter a valid symbol', // 19
  'Not a valid ERC-20 token', // 20
  'Could not estimate gas. There are not enough funds in the account, or the receiving contract address would throw an error. Feel free to manually set the gas and proceed. The error message upon sending may be more informative.', // 21
  'Please enter valid node name', // 22
  'Enter valid URL. If you are on https, your URL must be https', // 23
  'Please enter a valid port. ', // 24
  'Please enter a valid chain ID. ', // 25
  'Please enter a valid ABI. ', // 26
  'Minimum amount: 0.01. Max amount: ', // 27
  'You need this `Keystore File + Password` or the `Private Key` (next page) to access this wallet in the future. ', // 28
  'Please enter a valid user and password. ', // 29
  'Please enter a valid name (7+ characters, limited punctuation) ', // 30
  'Please enter a valid secret phrase. ', // 31
  'Could not connect to the node. Try refreshing, using different node in upper right corner, and checking firewall settings. If custom node, check your configs.', // 32
  "The wallet you have unlocked does not match the owner's address. ", // 33
  'The name you are attempting to reveal does not match the name you have entered. ', // 34
  'Input address is not checksummed. <a href="https://myetherwallet.groovehq.com/knowledge_base/topics/not-checksummed-shows-when-i-enter-an-address" target="_blank" rel="noopener"> More info</a>', // 35
  'Enter valid TX hash', // 36
  'Enter valid hex string (0-9, a-f)' // 37
];

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

export const NETWORKS = {
  ETH: {
    name: 'ETH',
    blockExplorerTX: 'https://etherscan.io/tx/[[txHash]]',
    blockExplorerAddr: 'https://etherscan.io/address/[[address]]',
    chainId: 1
  }
};

export const NODES = {
  eth_mew: {
    network: 'ETH',
    lib: new RPCNode('https://api.myetherapi.com/eth'),
    service: 'MyEtherWallet',
    estimateGas: true,
    eip155: true
    // 'tokenList': require('./tokens/ethTokens.json'),
    // 'abiList': require('./abiDefinitions/ethAbi.json'),
  }
};
