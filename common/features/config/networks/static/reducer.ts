import {
  ethPlorer,
  ETHTokenExplorer,
  gasPriceDefaults,
  InsecureWalletName,
  SecureWalletName
} from 'config/data';
import {
  ELLA_DEFAULT,
  ETC_LEDGER,
  ETC_TREZOR,
  ETH_DEFAULT,
  ETH_LEDGER,
  ETH_TESTNET,
  ETH_TREZOR,
  EXP_DEFAULT,
  POA_DEFAULT,
  TOMO_DEFAULT,
  UBQ_DEFAULT,
  MUSIC_DEFAULT,
  ETSC_DEFAULT,
  EGEM_DEFAULT,
  CLO_DEFAULT,
  RSK_TESTNET,
  GO_DEFAULT,
  EOSC_DEFAULT
} from 'config/dpaths';
import { makeExplorer } from 'utils/helpers';
import { StaticNetworksState } from './types';

const testnetDefaultGasPrice = {
  min: 0.1,
  max: 40,
  initial: 4
};

export const STATIC_NETWORKS_INITIAL_STATE: StaticNetworksState = {
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    unit: 'ETH',
    chainId: 1,
    isCustom: false,
    color: '#007896',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://etherscan.io'
    }),
    tokenExplorer: {
      name: ethPlorer,
      address: ETHTokenExplorer
    },
    tokens: require('config/tokens/eth.json'),
    contracts: require('config/contracts/eth.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TREZOR,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_DEFAULT
    },
    gasPriceSettings: gasPriceDefaults,
    shouldEstimateGasPrice: true
  },
  Ropsten: {
    id: 'Ropsten',
    name: 'Ropsten',
    unit: 'ETH',
    chainId: 3,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://ropsten.etherscan.io'
    }),
    tokens: require('config/tokens/ropsten.json'),
    contracts: require('config/contracts/ropsten.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
    },
    gasPriceSettings: testnetDefaultGasPrice
  },
  Kovan: {
    id: 'Kovan',
    name: 'Kovan',
    unit: 'ETH',
    chainId: 42,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://kovan.etherscan.io'
    }),
    tokens: require('config/tokens/ropsten.json'),
    contracts: require('config/contracts/ropsten.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
    },
    gasPriceSettings: testnetDefaultGasPrice
  },
  Rinkeby: {
    id: 'Rinkeby',
    name: 'Rinkeby',
    unit: 'ETH',
    chainId: 4,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://rinkeby.etherscan.io'
    }),
    tokens: require('config/tokens/rinkeby.json'),
    contracts: require('config/contracts/rinkeby.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
    },
    gasPriceSettings: testnetDefaultGasPrice
  },
  ETC: {
    id: 'ETC',
    name: 'Ethereum Classic',
    unit: 'ETC',
    chainId: 61,
    isCustom: false,
    color: '#669073',
    blockExplorer: makeExplorer({
      name: 'GasTracker',
      origin: 'https://gastracker.io',
      addressPath: 'addr'
    }),
    tokens: require('config/tokens/etc.json'),
    contracts: require('config/contracts/etc.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETC_TREZOR,
      [SecureWalletName.LEDGER_NANO_S]: ETC_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETC_TREZOR
    },
    gasPriceSettings: {
      min: 0.1,
      max: 10,
      initial: 1
    }
  },
  UBQ: {
    id: 'UBQ',
    name: 'Ubiq',
    unit: 'UBQ',
    chainId: 8,
    isCustom: false,
    color: '#b37aff',
    blockExplorer: makeExplorer({
      name: 'Ubiqscan',
      origin: 'https://ubiqscan.io/en'
    }),
    tokens: require('config/tokens/ubq.json'),
    contracts: require('config/contracts/ubq.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: UBQ_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: UBQ_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: UBQ_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  EXP: {
    id: 'EXP',
    name: 'Expanse',
    unit: 'EXP',
    chainId: 2,
    isCustom: false,
    color: '#673ab7',
    blockExplorer: makeExplorer({
      name: 'Gander',
      origin: 'https://www.gander.tech'
    }),
    tokens: require('config/tokens/exp.json'),
    contracts: require('config/contracts/exp.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: EXP_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: EXP_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: EXP_DEFAULT
    },
    gasPriceSettings: {
      min: 0.1,
      max: 20,
      initial: 2
    }
  },
  POA: {
    id: 'POA',
    name: 'POA',
    unit: 'POA',
    chainId: 99,
    isCustom: false,
    color: '#6d2eae',
    blockExplorer: makeExplorer({
      name: 'Etherchain Light',
      origin: 'https://poaexplorer.com',
      addressPath: 'address/search',
      blockPath: 'blocks/block'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: POA_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: POA_DEFAULT
    },
    gasPriceSettings: {
      min: 0.1,
      max: 10,
      initial: 1
    }
  },
  TOMO: {
    id: 'TOMO',
    name: 'TomoChain',
    unit: 'TOMO',
    chainId: 40686,
    isCustom: false,
    color: '#6a488d',
    blockExplorer: makeExplorer({
      name: 'Tomochain Explorer',
      origin: 'https://explorer.tomocoin.io/#'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [SecureWalletName.TREZOR]: ETH_TREZOR,
      [SecureWalletName.LEDGER_NANO_S]: TOMO_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: TOMO_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  ELLA: {
    id: 'ELLA',
    name: 'Ellaism',
    unit: 'ELLA',
    chainId: 64,
    isCustom: false,
    color: '#046111',
    blockExplorer: makeExplorer({
      name: 'Ellaism Explorer',
      origin: 'https://explorer.ellaism.org'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: ELLA_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: ELLA_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },

  MUSIC: {
    id: 'MUSIC',
    name: 'Musicoin',
    unit: 'MUSIC',
    chainId: 7762959,
    isCustom: false,
    color: '#ffbb00',
    blockExplorer: makeExplorer({
      name: 'Musicoin Explorer',
      origin: 'https://explorer.musicoin.org',
      addressPath: 'account'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: MUSIC_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: MUSIC_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },

  ETSC: {
    id: 'ETSC',
    name: 'Ethereum Social',
    unit: 'ETSC',
    chainId: 28,
    isCustom: false,
    color: '#4295d1',
    blockExplorer: makeExplorer({
      name: 'Ethereum Social Explorer',
      origin: 'https://explorer.ethereumsocial.kr'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETSC_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETSC_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },

  EGEM: {
    id: 'EGEM',
    name: 'EtherGem',
    unit: 'EGT',
    chainId: 1987,
    isCustom: false,
    color: '#D0F7FF',
    blockExplorer: makeExplorer({
      name: 'EtherGem Explorer',
      origin: 'https://explorer.egem.io'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: EGEM_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: EGEM_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },

  CLO: {
    id: 'CLO',
    name: 'Callisto',
    unit: 'CLO',
    chainId: 820,
    isCustom: false,
    color: '#00b04a',
    blockExplorer: makeExplorer({
      name: 'Callisto Explorer',
      origin: 'https://explorer.callisto.network'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: CLO_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: CLO_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },

  RSK_TESTNET: {
    id: 'RSK_TESTNET',
    name: 'RSK',
    unit: 'SBTC',
    chainId: 31,
    color: '#58A052',
    isCustom: false,
    blockExplorer: makeExplorer({
      name: 'RSK Testnet Explorer',
      origin: 'https://explorer.testnet.rsk.co'
    }),
    tokens: require('config/tokens/rsk.json'),
    contracts: require('config/contracts/rsk.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: RSK_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: RSK_TESTNET,
      [InsecureWalletName.MNEMONIC_PHRASE]: RSK_TESTNET
    },
    gasPriceSettings: {
      min: 0.183,
      max: 1.5,
      initial: 0.183
    }
  },

  GO: {
    id: 'GO',
    name: 'GO',
    unit: 'GO',
    chainId: 60,
    isCustom: false,
    color: '#00b04a',
    blockExplorer: makeExplorer({
      name: 'GoChain Explorer',
      origin: 'https://explorer.gochain.io'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: GO_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: GO_DEFAULT
    },
    gasPriceSettings: {
      min: 2,
      max: 60,
      initial: 2
    }
  },

  EOSC: {
    id: 'EOSC',
    name: 'EOS Classic',
    unit: 'EOSC',
    chainId: 20,
    isCustom: false,
    color: '#926565',
    blockExplorer: makeExplorer({
      name: 'EOSC Explorer',
      origin: 'https://explorer.eos-classic.io'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: EOSC_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: EOSC_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  }
};

export function staticNetworksReducer(
  state: StaticNetworksState = STATIC_NETWORKS_INITIAL_STATE,
  action: any
) {
  switch (action.type) {
    default:
      return state;
  }
}
