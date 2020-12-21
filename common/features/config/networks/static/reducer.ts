import { TAB } from 'components/Header/components/constants';
import {
  ethPlorer,
  ETHTokenExplorer,
  gasPriceDefaults,
  InsecureWalletName,
  SecureWalletName
} from 'config/data';
import {
  AKA_DEFAULT,
  ARTIS_SIGMA1,
  ARTIS_TAU1,
  ASK_DEFAULT,
  ASK_TREZOR,
  ATH_DEFAULT,
  CLO_DEFAULT,
  DEXON_DEFAULT,
  EGEM_DEFAULT,
  ESN_DEFAULT,
  ETC_LEDGER,
  ETC_SAFE_T,
  ETC_TREZOR,
  ETHO_DEFAULT,
  ETH_DEFAULT,
  ETH_LEDGER,
  ETH_SAFE_T,
  ETH_TESTNET,
  ETH_TREZOR,
  ETI_DEFAULT,
  EXP_DEFAULT,
  XDC_DEFAULT,
  GO_DEFAULT,
  METADIUM_DEFAULT,
  MIX_DEFAULT,
  MUSIC_DEFAULT,
  PIRL_DEFAULT,
  POA_DEFAULT,
  REOSC_DEFAULT,
  RSK_MAINNET,
  RSK_TESTNET,
  THUNDERCORE_DEFAULT,
  TOMO_DEFAULT,
  UBQ_DEFAULT,
  WEB_DEFAULT,
  AUX_DEFAULT,
  ERE_DEFAULT,
  VOLTA_DEFAULT,
  EWC_DEFAULT
} from 'config/dpaths';
import { makeExplorer } from 'utils/helpers';
import * as types from './types';

const testnetDefaultGasPrice = {
  min: 0.1,
  max: 40,
  initial: 4
};

export const STATIC_NETWORKS_INITIAL_STATE: types.ConfigStaticNetworksState = {
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
      [SecureWalletName.SAFE_T]: ETH_SAFE_T,
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
      [SecureWalletName.SAFE_T]: ETH_TESTNET,
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
      [SecureWalletName.SAFE_T]: ETH_TESTNET,
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
      [SecureWalletName.SAFE_T]: ETH_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
    },
    gasPriceSettings: testnetDefaultGasPrice
  },
  Goerli: {
    id: 'Goerli',
    name: 'Goerli',
    unit: 'ETH',
    chainId: 5,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://goerli.etherscan.io/'
    }),
    tokens: [],
    contracts: [],
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TESTNET,
      [SecureWalletName.SAFE_T]: ETH_TESTNET,
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
      name: 'BlockScout',
      origin: 'https://blockscout.com/etc/mainnet',
      addressPath: 'address'
    }),
    tokens: require('config/tokens/etc.json'),
    contracts: require('config/contracts/etc.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETC_TREZOR,
      [SecureWalletName.SAFE_T]: ETC_SAFE_T,
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
      origin: 'https://ubiqscan.io'
    }),
    tokens: require('config/tokens/ubq.json'),
    contracts: require('config/contracts/ubq.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: UBQ_DEFAULT,
      [SecureWalletName.SAFE_T]: UBQ_DEFAULT,
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
      [SecureWalletName.SAFE_T]: EXP_DEFAULT,
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
      name: 'BlockScout',
      origin: 'https://blockscout.com/poa/core',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: POA_DEFAULT,
      [SecureWalletName.SAFE_T]: POA_DEFAULT,
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
    chainId: 88,
    isCustom: false,
    color: '#6a488d',
    blockExplorer: makeExplorer({
      name: 'Tomochain Explorer',
      origin: 'https://scan.tomochain.com'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [SecureWalletName.TREZOR]: ETH_TREZOR,
      [SecureWalletName.SAFE_T]: ETH_SAFE_T,
      [SecureWalletName.LEDGER_NANO_S]: TOMO_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: TOMO_DEFAULT
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
      [SecureWalletName.SAFE_T]: MUSIC_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: MUSIC_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: MUSIC_DEFAULT
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
    unit: 'EGEM',
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
      [SecureWalletName.SAFE_T]: EGEM_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: EGEM_DEFAULT,
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
      [SecureWalletName.SAFE_T]: CLO_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: CLO_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: CLO_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },

  RSK: {
    id: 'RSK',
    name: 'RSK',
    unit: 'RBTC',
    chainId: 30,
    color: '#58A052',
    isCustom: false,
    blockExplorer: makeExplorer({
      name: 'RSK Explorer',
      origin: 'https://explorer.rsk.co'
    }),
    tokens: require('config/tokens/rsk.json'),
    contracts: require('config/contracts/rsk.json'),
    isTestnet: false,
    dPathFormats: {
      [SecureWalletName.TREZOR]: RSK_MAINNET,
      [SecureWalletName.LEDGER_NANO_S]: RSK_MAINNET,
      [InsecureWalletName.MNEMONIC_PHRASE]: RSK_MAINNET
    },
    gasPriceSettings: {
      min: 0.06,
      max: 1.5,
      initial: 0.06
    },
    unsupportedTabs: [TAB.ENS],
    hideEquivalentValues: true
  },

  RSK_TESTNET: {
    id: 'RSK_TESTNET',
    name: 'RSK Testnet',
    unit: 'RBTC',
    chainId: 31,
    color: '#58A052',
    isCustom: false,
    blockExplorer: makeExplorer({
      name: 'RSK Testnet Explorer',
      origin: 'https://explorer.testnet.rsk.co'
    }),
    tokens: require('config/tokens/rsk_testnet.json'),
    contracts: require('config/contracts/rsk_testnet.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: RSK_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: RSK_TESTNET,
      [InsecureWalletName.MNEMONIC_PHRASE]: RSK_TESTNET
    },
    gasPriceSettings: {
      min: 0.06,
      max: 1.5,
      initial: 0.06
    },
    unsupportedTabs: [TAB.ENS]
  },

  XDC: {
    id: 'XDC',
    name: 'XDC',
    unit: 'XDC',
    chainId: 50,
    isCustom: false,
    color: '#00b04a',
    blockExplorer: makeExplorer({
      name: 'XDCScan Explorer',
      origin: 'https://explorer.xinfin.network'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: XDC_DEFAULT,
      [SecureWalletName.SAFE_T]: XDC_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: XDC_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: XDC_DEFAULT
    },
    gasPriceSettings: {
      min: 2,
      max: 60,
      initial: 2
    }
  },

  XDC_TESTNET: {
    id: 'XDC_TESTNET',
    name: 'XDC Apothem',
    unit: 'XDC',
    chainId: 51,
    isCustom: false,
    color: '#00b04a',
    blockExplorer: makeExplorer({
      name: 'XDC Apothem Explorer',
      origin: 'https://explorer.Apothem.network'
    }),
    tokens: [],
    contracts: [],
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: XDC_DEFAULT,
      [SecureWalletName.SAFE_T]: XDC_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: XDC_DEFAULT
    },
    gasPriceSettings: {
      min: 2,
      max: 60,
      initial: 2
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
      [SecureWalletName.SAFE_T]: GO_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: GO_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: GO_DEFAULT
    },
    gasPriceSettings: {
      min: 2,
      max: 60,
      initial: 2
    }
  },

  GO_TESTNET: {
    id: 'GO_TESTNET',
    name: 'GO Testnet',
    unit: 'GO',
    chainId: 31337,
    isCustom: false,
    color: '#00b04a',
    blockExplorer: makeExplorer({
      name: 'GoChain Testnet Explorer',
      origin: 'https://testnet-explorer.gochain.io'
    }),
    tokens: [],
    contracts: [],
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: GO_DEFAULT,
      [SecureWalletName.SAFE_T]: GO_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: GO_DEFAULT
    },
    gasPriceSettings: {
      min: 2,
      max: 60,
      initial: 2
    }
  },

  ESN: {
    id: 'ESN',
    name: 'EthersocialNetwork',
    unit: 'ESN',
    chainId: 31102,
    isCustom: false,
    color: '#7a56ad',
    blockExplorer: makeExplorer({
      name: 'ESN Explorer',
      origin: 'https://ethersocial.net'
    }),
    tokens: require('config/tokens/esn.json'),
    contracts: require('config/contracts/esn.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: ESN_DEFAULT,
      [SecureWalletName.SAFE_T]: ESN_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: ESN_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: ESN_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  AQUA: {
    id: 'AQUA',
    name: 'Aquachain',
    unit: 'AQUA',
    chainId: 61717561,
    isCustom: false,
    color: '#00ffff',
    blockExplorer: makeExplorer({
      name: 'AQUA Explorer',
      origin: 'https://aquachain.github.io/explorer/#'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: ETH_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_DEFAULT
    },
    gasPriceSettings: {
      min: 0.1,
      max: 10,
      initial: 0.1
    }
  },
  AKA: {
    id: 'AKA',
    name: 'Akroma',
    unit: 'AKA',
    chainId: 200625,
    isCustom: false,
    color: '#aa0087',
    blockExplorer: makeExplorer({
      name: 'Akroma Explorer',
      origin: 'https://explorer.akroma.io'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: AKA_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: AKA_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: AKA_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  PIRL: {
    id: 'PIRL',
    name: 'Pirl',
    unit: 'PIRL',
    chainId: 3125659152,
    isCustom: false,
    color: '#a2d729',
    blockExplorer: makeExplorer({
      name: 'Pirl Poseidon Explorer',
      origin: 'https://devexplorer.pirl.io'
    }),
    tokens: [],
    contracts: require('config/contracts/pirl.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: PIRL_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: PIRL_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: PIRL_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  ATH: {
    id: 'ATH',
    name: 'Atheios',
    unit: 'ATH',
    chainId: 1620,
    isCustom: false,
    color: '#0093c5',
    blockExplorer: makeExplorer({
      name: 'Atheios Explorer',
      origin: 'https://explorer.atheios.com'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: ATH_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: ATH_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: ATH_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  ETHO: {
    id: 'ETHO',
    name: 'Ether-1',
    unit: 'ETHO',
    chainId: 1313114,
    isCustom: false,
    color: '#7a1336',
    blockExplorer: makeExplorer({
      name: 'Ether-1 Explorer',
      origin: 'https://explorer.ether1.org'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETHO_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: ETHO_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETHO_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  MIX: {
    id: 'MIX',
    name: 'Mix',
    unit: 'MIX',
    chainId: 76,
    isCustom: false,
    color: '#e59b2b',
    blockExplorer: makeExplorer({
      name: 'MIX Blockchain Explorer',
      origin: 'https://blocks.mix-blockchain.org'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: MIX_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: MIX_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: MIX_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  REOSC: {
    id: 'REOSC',
    name: 'REOSC',
    unit: 'REOSC',
    chainId: 2894,
    isCustom: false,
    color: '#1500db',
    blockExplorer: makeExplorer({
      name: 'REOSC Explorer',
      origin: 'https://explorer.reosc.io'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: REOSC_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: REOSC_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: REOSC_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  ARTIS_SIGMA1: {
    id: 'ARTIS_SIGMA1',
    name: 'ARTIS sigma1',
    unit: 'ATS',
    chainId: 246529,
    isCustom: false,
    color: '#238006',
    blockExplorer: makeExplorer({
      name: 'BlockScout',
      origin: 'https://explorer.sigma1.artis.network',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    tokens: [],
    contracts: [],
    isTestnet: false,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ARTIS_SIGMA1,
      [SecureWalletName.SAFE_T]: ARTIS_SIGMA1,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ARTIS_SIGMA1
    },
    gasPriceSettings: {
      min: 1,
      max: 1,
      initial: 1
    }
  },
  ARTIS_TAU1: {
    id: 'ARTIS_TAU1',
    name: 'ARTIS tau1',
    unit: 'ATS',
    chainId: 246785,
    isCustom: false,
    color: '#238006',
    blockExplorer: makeExplorer({
      name: 'BlockScout',
      origin: 'https://explorer.tau1.artis.network',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    tokens: [],
    contracts: [],
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ARTIS_TAU1,
      [SecureWalletName.SAFE_T]: ARTIS_TAU1,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ARTIS_TAU1
    },
    gasPriceSettings: {
      min: 1,
      max: 1,
      initial: 1
    }
  },
  THUNDERCORE: {
    id: 'THUNDERCORE',
    name: 'ThunderCore',
    unit: 'TT',
    chainId: 108,
    isCustom: false,
    color: '#ffc000',
    blockExplorer: makeExplorer({
      name: 'ThunderScan',
      origin: 'https://scan.thundercore.com'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.LEDGER_NANO_S]: THUNDERCORE_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: THUNDERCORE_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 1
    }
  },
  WEB: {
    id: 'WEB',
    name: 'Webchain',
    unit: 'WEB',
    chainId: 24484,
    isCustom: false,
    color: '#0092ee',
    blockExplorer: makeExplorer({
      name: 'Webchain Explorer',
      origin: 'https://explorer.webchain.network'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [InsecureWalletName.MNEMONIC_PHRASE]: WEB_DEFAULT
    },
    gasPriceSettings: {
      min: 100,
      max: 400,
      initial: 200
    }
  },
  METADIUM: {
    id: 'METADIUM',
    name: 'Metadium',
    unit: 'META',
    chainId: 11,
    isCustom: false,
    color: '#ffc000',
    blockExplorer: makeExplorer({
      name: 'Metadium Explorer',
      origin: 'https://explorer.metadium.com/'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: METADIUM_DEFAULT
    },
    gasPriceSettings: {
      min: 80,
      max: 80,
      initial: 80
    }
  },
  DEXON: {
    id: 'DEXON',
    name: 'DEXON Network',
    unit: 'DXN',
    chainId: 237,
    isCustom: false,
    color: '#954a97',
    blockExplorer: makeExplorer({
      name: 'DEXON Scan',
      origin: 'https://dexonscan.app',
      txPath: 'transaction'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.LEDGER_NANO_S]: DEXON_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: DEXON_DEFAULT
    },
    gasPriceSettings: {
      min: 24,
      max: 100,
      initial: 24
    }
  },
  ETI: {
    id: 'ETI',
    name: 'Etherinc',
    unit: 'ETI',
    chainId: 101,
    isCustom: false,
    color: '#3560bf',
    blockExplorer: makeExplorer({
      name: 'Etherinc Explorer',
      origin: 'https://explorer.einc.io'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETI_DEFAULT,
      [SecureWalletName.SAFE_T]: ETI_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETI_DEFAULT
    },
    gasPriceSettings: {
      min: 2,
      max: 60,
      initial: 2
    }
  },
  ASK: {
    id: 'ASK',
    name: 'Permission',
    unit: 'ASK',
    chainId: 222,
    isCustom: false,
    color: '#000',
    blockExplorer: makeExplorer({
      name: 'Permission explorer',
      origin: 'https://explorer.permission.io',
      txPath: 'transactions',
      addressPath: 'wallets',
      blockPath: 'blocks'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: ASK_TREZOR,
      [InsecureWalletName.MNEMONIC_PHRASE]: ASK_DEFAULT
    },
    gasPriceSettings: {
      min: 4.77,
      max: 100,
      initial: 4.77
    },
    shouldEstimateGasPrice: false
  },
  AUX: {
    id: 'AUX',
    name: 'Auxilium',
    unit: 'AUX',
    chainId: 28945486,
    isCustom: false,
    color: '#85dc35',
    blockExplorer: makeExplorer({
      name: 'Auxilium Explore',
      origin: 'https://explore.auxilium.global/'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.SAFE_T]: AUX_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: AUX_DEFAULT
    },
    gasPriceSettings: {
      min: 0.1,
      max: 40,
      initial: 4
    }
  },
  ERE: {
    id: 'ERE',
    name: 'EtherCore',
    unit: 'ERE',
    chainId: 466,
    isCustom: false,
    color: '#3a6ea7',
    blockExplorer: makeExplorer({
      name: 'EtherCore Explorer',
      origin: 'https://explorer.ethercore.io'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: ERE_DEFAULT,
      [SecureWalletName.SAFE_T]: ERE_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: ERE_DEFAULT
    },
    gasPriceSettings: {
      min: 0,
      max: 60,
      initial: 1
    }
  },
  VOLTA: {
    id: 'VOLTA',
    name: 'Volta',
    unit: 'VT',
    chainId: 73799,
    isCustom: false,
    color: '#6d2eae',
    isTestnet: false,
    blockExplorer: makeExplorer({
      name: 'Enenrgy Web VOLTA Explorer',
      origin: 'https://volta-explorer.energyweb.org',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: VOLTA_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: VOLTA_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: VOLTA_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 10,
      initial: 1
    },
    shouldEstimateGasPrice: false
  },
  EnergyWebChain: {
    id: 'EnergyWebChain',
    name: 'EWC',
    unit: 'EWT',
    chainId: 246,
    isCustom: false,
    color: '#6d2eae',
    blockExplorer: makeExplorer({
      name: 'Enenrgy Web Chain Explorer',
      origin: 'https://explorer.energyweb.org',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: EWC_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: EWC_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: EWC_DEFAULT
    },
    gasPriceSettings: {
      min: 0.01,
      max: 10,
      initial: 0.01
    }
  }
};

export function staticNetworksReducer(
  state: types.ConfigStaticNetworksState = STATIC_NETWORKS_INITIAL_STATE,
  action: any
) {
  switch (action.type) {
    default:
      return state;
  }
}
