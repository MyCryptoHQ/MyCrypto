export const DONATION_ADDRESSES_MAP = {
  BTC: '1MEWT2SGbqtz6mPCgFcnea8XmWV5Z4Wc6',
  ETH: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  REP: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8'
};

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

export const nodeList = [
  {
    name: 'ETH',
    blockExplorerTX: 'https://etherscan.io/tx/[[txHash]]',
    blockExplorerAddr: 'https://etherscan.io/address/[[address]]',
    // 'type': nodes.nodeTypes.ETH,
    eip155: true,
    chainId: 1,
    // 'tokenList': require('./tokens/ethTokens.json'),
    // 'abiList': require('./abiDefinitions/ethAbi.json'),
    estimateGas: true,
    service: 'MyEtherWallet'
    // 'lib': new nodes.customNode('https://api.myetherapi.com/eth', '')
  },
  {
    name: 'ETH',
    blockExplorerTX: 'https://etherscan.io/tx/[[txHash]]',
    blockExplorerAddr: 'https://etherscan.io/address/[[address]]',
    // 'type': nodes.nodeTypes.ETH,
    eip155: true,
    chainId: 1,
    // 'tokenList': require('./tokens/ethTokens.json'),
    // 'abiList': require('./abiDefinitions/ethAbi.json'),
    estimateGas: false,
    service: 'Etherscan.io'
    // 'lib': require('./nodeHelpers/etherscan')
  },
  {
    name: 'Ropsten',
    // 'type': nodes.nodeTypes.Ropsten,
    blockExplorerTX: 'https://ropsten.etherscan.io/tx/[[txHash]]',
    blockExplorerAddr: 'https://ropsten.etherscan.io/address/[[address]]',
    eip155: true,
    chainId: 3,
    // 'tokenList': require('./tokens/ropstenTokens.json'),
    // 'abiList': require('./abiDefinitions/ropstenAbi.json'),
    estimateGas: false,
    service: 'MyEtherWallet'
    // 'lib': new nodes.customNode('https://api.myetherapi.com/rop', '')
  },
  {
    name: 'Kovan',
    // 'type': nodes.nodeTypes.Kovan,
    blockExplorerTX: 'https://kovan.etherscan.io/tx/[[txHash]]',
    blockExplorerAddr: 'https://kovan.etherscan.io/address/[[address]]',
    eip155: true,
    chainId: 42,
    // 'tokenList': require('./tokens/kovanTokens.json'),
    // 'abiList': require('./abiDefinitions/kovanAbi.json'),
    estimateGas: false,
    service: 'Etherscan.io'
    // 'lib': require('./nodeHelpers/etherscanKov')
  },
  {
    name: 'ETC',
    blockExplorerTX: 'https://gastracker.io/tx/[[txHash]]',
    blockExplorerAddr: 'https://gastracker.io/addr/[[address]]',
    // 'type': nodes.nodeTypes.ETC,
    eip155: true,
    chainId: 61,
    // 'tokenList': require('./tokens/etcTokens.json'),
    // 'abiList': require('./abiDefinitions/etcAbi.json'),
    estimateGas: false,
    service: 'Epool.io'
    // 'lib': new nodes.customNode('https://mewapi.epool.io', '')
  }
];
