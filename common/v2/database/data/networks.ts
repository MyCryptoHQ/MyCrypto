// @TODO Used for unsupportedTabs. update to unsupportedPaths
// import { TAB } from 'components/Header/components/constants';

import { WalletId, NetworkId, TSymbol, NetworkLegacy } from 'v2/types';
import { makeExplorer } from 'v2/services/EthService/utils/makeExplorer';
import {
  DPathsList as DPaths,
  ethPlorer,
  ETHTokenExplorer,
  GAS_PRICE_TESTNET,
  GAS_PRICE_DEFAULT
} from 'v2/config';

// Temporay type to bridge the difference between v1 and v2 network definitions.
export type NetworkConfig = {
  [key in NetworkId]: NetworkLegacy;
};

export const NETWORKS_CONFIG: NetworkConfig = {
  Ethereum: {
    id: 'Ethereum',
    name: 'Ethereum',
    unit: 'ETH' as TSymbol,
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
    tokens: require('./tokens/eth.json'),
    contracts: require('./contracts/eth.json'),
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TREZOR,
      [WalletId.SAFE_T_MINI]: DPaths.ETH_SAFE_T,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ETH_DEFAULT
    },
    gasPriceSettings: GAS_PRICE_DEFAULT,
    shouldEstimateGasPrice: true
  },
  Ropsten: {
    id: 'Ropsten',
    name: 'Ropsten',
    unit: 'RopstenETH' as TSymbol,
    chainId: 3,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://ropsten.etherscan.io'
    }),
    tokens: require('./tokens/rop.json'),
    contracts: require('./contracts/ropsten.json'),
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TESTNET,
      [WalletId.SAFE_T_MINI]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ETH_TESTNET
    },
    gasPriceSettings: GAS_PRICE_TESTNET
  },
  Kovan: {
    id: 'Kovan',
    name: 'Kovan',
    unit: 'KovanETH' as TSymbol,
    chainId: 42,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://kovan.etherscan.io'
    }),
    tokens: require('./tokens/kov.json'),
    contracts: require('./contracts/kovan.json'),
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TESTNET,
      [WalletId.SAFE_T_MINI]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ETH_TESTNET
    },
    gasPriceSettings: GAS_PRICE_DEFAULT
  },
  Rinkeby: {
    id: 'Rinkeby',
    name: 'Rinkeby',
    unit: 'RinkebyETH' as TSymbol,
    chainId: 4,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://rinkeby.etherscan.io'
    }),
    tokens: require('./tokens/rin.json'),
    contracts: require('./contracts/rinkeby.json'),
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TESTNET,
      [WalletId.SAFE_T_MINI]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ETH_TESTNET
    },
    gasPriceSettings: GAS_PRICE_TESTNET
  },
  Goerli: {
    id: 'Goerli',
    name: 'Goerli',
    unit: 'GoerliETH' as TSymbol,
    chainId: 5,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://goerli.etherscan.io/'
    }),
    tokens: require('./tokens/gor.json'),
    contracts: [],
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TESTNET,
      [WalletId.SAFE_T_MINI]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ETH_TESTNET
    },
    gasPriceSettings: GAS_PRICE_TESTNET
  },
  ETC: {
    id: 'ETC',
    name: 'Ethereum Classic',
    unit: 'ETC' as TSymbol,
    chainId: 61,
    isCustom: false,
    color: '#669073',
    blockExplorer: makeExplorer({
      name: 'BlockScout',
      origin: 'https://blockscout.com/etc/mainnet',
      addressPath: 'address'
    }),
    tokens: require('./tokens/etc.json'),
    contracts: require('./contracts/etc.json'),
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETC_TREZOR,
      [WalletId.SAFE_T_MINI]: DPaths.ETH_SAFE_T,
      [WalletId.LEDGER_NANO_S]: DPaths.ETC_LEDGER,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ETC_TREZOR
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
    unit: 'UBQ' as TSymbol,
    chainId: 8,
    isCustom: false,
    color: '#b37aff',
    blockExplorer: makeExplorer({
      name: 'Ubiqscan',
      origin: 'https://ubiqscan.io'
    }),
    tokens: require('./tokens/ubq.json'),
    contracts: require('./contracts/ubq.json'),
    dPaths: {
      [WalletId.TREZOR]: DPaths.UBQ_DEFAULT,
      [WalletId.SAFE_T_MINI]: DPaths.UBQ_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.UBQ_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.UBQ_DEFAULT
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
    unit: 'EXP' as TSymbol,
    chainId: 2,
    isCustom: false,
    color: '#673ab7',
    blockExplorer: makeExplorer({
      name: 'Gander',
      origin: 'https://www.gander.tech'
    }),
    tokens: require('./tokens/exp.json'),
    contracts: require('./contracts/exp.json'),
    dPaths: {
      [WalletId.TREZOR]: DPaths.EXP_DEFAULT,
      [WalletId.SAFE_T_MINI]: DPaths.EXP_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.EXP_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.EXP_DEFAULT
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
    unit: 'POA' as TSymbol,
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
    dPaths: {
      [WalletId.TREZOR]: DPaths.POA_DEFAULT,
      [WalletId.SAFE_T_MINI]: DPaths.POA_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.MNEMONIC_PHRASE]: DPaths.POA_DEFAULT
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
    unit: 'TOMO' as TSymbol,
    chainId: 88,
    isCustom: false,
    color: '#6a488d',
    blockExplorer: makeExplorer({
      name: 'Tomochain Explorer',
      origin: 'https://scan.tomochain.com'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.TREZOR]: DPaths.ETH_TREZOR,
      [WalletId.SAFE_T_MINI]: DPaths.ETH_SAFE_T,
      [WalletId.LEDGER_NANO_S]: DPaths.TOMO_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.TOMO_DEFAULT
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
    unit: 'MUSIC' as TSymbol,
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
    dPaths: {
      [WalletId.TREZOR]: DPaths.MUSIC_DEFAULT,
      [WalletId.SAFE_T_MINI]: DPaths.MUSIC_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.MUSIC_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.MUSIC_DEFAULT
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
    unit: 'EGEM' as TSymbol,
    chainId: 1987,
    isCustom: false,
    color: '#D0F7FF',
    blockExplorer: makeExplorer({
      name: 'EtherGem Explorer',
      origin: 'https://explorer.egem.io'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.EGEM_DEFAULT,
      [WalletId.SAFE_T_MINI]: DPaths.EGEM_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.EGEM_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.EGEM_DEFAULT
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
    unit: 'CLO' as TSymbol,
    chainId: 820,
    isCustom: false,
    color: '#00b04a',
    blockExplorer: makeExplorer({
      name: 'Callisto Explorer',
      origin: 'https://explorer.callisto.network'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.CLO_DEFAULT,
      [WalletId.SAFE_T_MINI]: DPaths.CLO_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.CLO_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.CLO_DEFAULT
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
    unit: 'RBTC' as TSymbol,
    chainId: 30,
    color: '#58A052',
    isCustom: false,
    blockExplorer: makeExplorer({
      name: 'RSK Explorer',
      origin: 'https://explorer.rsk.co'
    }),
    tokens: require('./tokens/rsk.json'),
    contracts: require('./contracts/rsk.json'),
    isTestnet: false,
    dPaths: {
      [WalletId.TREZOR]: DPaths.RSK_MAINNET,
      [WalletId.LEDGER_NANO_S]: DPaths.RSK_MAINNET,
      [WalletId.MNEMONIC_PHRASE]: DPaths.RSK_MAINNET
    },
    gasPriceSettings: {
      min: 0.06,
      max: 1.5,
      initial: 0.06
    },
    //unsupportedTabs: [TAB.ENS],
    hideEquivalentValues: true
  },

  RSK_TESTNET: {
    id: 'RSK_TESTNET',
    name: 'RSK Testnet',
    unit: 'RBTC' as TSymbol,
    chainId: 31,
    color: '#58A052',
    isCustom: false,
    blockExplorer: makeExplorer({
      name: 'RSK Testnet Explorer',
      origin: 'https://explorer.testnet.rsk.co'
    }),
    tokens: require('./tokens/rsk_testnet.json'),
    contracts: require('./contracts/rsk_testnet.json'),
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.RSK_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.RSK_TESTNET,
      [WalletId.MNEMONIC_PHRASE]: DPaths.RSK_TESTNET
    },
    gasPriceSettings: {
      min: 0.06,
      max: 1.5,
      initial: 0.06
    }
    //unsupportedTabs: [TAB.ENS]
  },

  GO: {
    id: 'GO',
    name: 'GO',
    unit: 'GO' as TSymbol,
    chainId: 60,
    isCustom: false,
    color: '#00b04a',
    blockExplorer: makeExplorer({
      name: 'GoChain Explorer',
      origin: 'https://explorer.gochain.io'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.GO_DEFAULT,
      [WalletId.SAFE_T_MINI]: DPaths.GO_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.GO_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.GO_DEFAULT
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
    unit: 'GO' as TSymbol,
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
    dPaths: {
      [WalletId.TREZOR]: DPaths.GO_DEFAULT,
      [WalletId.SAFE_T_MINI]: DPaths.GO_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.GO_DEFAULT
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
    unit: 'ESN' as TSymbol,
    chainId: 31102,
    isCustom: false,
    color: '#7a56ad',
    blockExplorer: makeExplorer({
      name: 'ESN Explorer',
      origin: 'https://ethersocial.net'
    }),
    tokens: require('./tokens/esn.json'),
    contracts: require('./contracts/esn.json'),
    dPaths: {
      [WalletId.TREZOR]: DPaths.ESN_DEFAULT,
      [WalletId.SAFE_T_MINI]: DPaths.ESN_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.ESN_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ESN_DEFAULT
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
    unit: 'AQUA' as TSymbol,
    chainId: 61717561,
    isCustom: false,
    color: '#00ffff',
    blockExplorer: makeExplorer({
      name: 'AQUA Explorer',
      origin: 'https://blockscout.aqua.signal2noi.se'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ETH_DEFAULT
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
    unit: 'AKA' as TSymbol,
    chainId: 200625,
    isCustom: false,
    color: '#aa0087',
    blockExplorer: makeExplorer({
      name: 'Akroma Explorer',
      origin: 'https://explorer.akroma.io'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.AKA_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.AKA_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.AKA_DEFAULT
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
    unit: 'PIRL' as TSymbol,
    chainId: 3125659152,
    isCustom: false,
    color: '#a2d729',
    blockExplorer: makeExplorer({
      name: 'Pirl Poseidon Explorer',
      origin: 'https://devexplorer.pirl.io'
    }),
    tokens: [],
    contracts: require('./contracts/pirl.json'),
    dPaths: {
      [WalletId.TREZOR]: DPaths.PIRL_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.PIRL_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.PIRL_DEFAULT
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
    unit: 'ATH' as TSymbol,
    chainId: 1620,
    isCustom: false,
    color: '#0093c5',
    blockExplorer: makeExplorer({
      name: 'Atheios Explorer',
      origin: 'https://explorer.atheios.com'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ATH_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.ATH_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ATH_DEFAULT
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
    unit: 'ETHO' as TSymbol,
    chainId: 1313114,
    isCustom: false,
    color: '#7a1336',
    blockExplorer: makeExplorer({
      name: 'Ether-1 Explorer',
      origin: 'https://explorer.ether1.org'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETHO_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.ETHO_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ETHO_DEFAULT
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
    unit: 'MIX' as TSymbol,
    chainId: 76,
    isCustom: false,
    color: '#e59b2b',
    blockExplorer: makeExplorer({
      name: 'MIX Blockchain Explorer',
      origin: 'https://blocks.mix-blockchain.org'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.MIX_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.MIX_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.MIX_DEFAULT
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
    unit: 'REOSC' as TSymbol,
    chainId: 2894,
    isCustom: false,
    color: '#1500db',
    blockExplorer: makeExplorer({
      name: 'REOSC Explorer',
      origin: 'https://explorer.reosc.io'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.REOSC_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.REOSC_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.REOSC_DEFAULT
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
    unit: 'ATS' as TSymbol,
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
    dPaths: {
      [WalletId.TREZOR]: DPaths.ARTIS_SIGMA1,
      [WalletId.SAFE_T_MINI]: DPaths.ARTIS_SIGMA1,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ARTIS_SIGMA1
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
    unit: 'ATS' as TSymbol,
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
    dPaths: {
      [WalletId.TREZOR]: DPaths.ARTIS_TAU1,
      [WalletId.SAFE_T_MINI]: DPaths.ARTIS_TAU1,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ARTIS_TAU1
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
    unit: 'TT' as TSymbol,
    chainId: 108,
    isCustom: false,
    color: '#ffc000',
    blockExplorer: makeExplorer({
      name: 'ThunderScan',
      origin: 'https://scan.thundercore.com'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.LEDGER_NANO_S]: DPaths.THUNDERCORE_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.THUNDERCORE_DEFAULT
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
    unit: 'WEB' as TSymbol,
    chainId: 24484,
    isCustom: false,
    color: '#0092ee',
    blockExplorer: makeExplorer({
      name: 'Webchain Explorer',
      origin: 'https://explorer.webchain.network'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.MNEMONIC_PHRASE]: DPaths.WEB_DEFAULT
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
    unit: 'META' as TSymbol,
    chainId: 11,
    isCustom: false,
    color: '#ffc000',
    blockExplorer: makeExplorer({
      name: 'Metadium Explorer',
      origin: 'https://explorer.metadium.com/'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.MNEMONIC_PHRASE]: DPaths.METADIUM_DEFAULT
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
    unit: 'DXN' as TSymbol,
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
    dPaths: {
      [WalletId.LEDGER_NANO_S]: DPaths.DEXON_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.DEXON_DEFAULT
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
    unit: 'ETI' as TSymbol,
    chainId: 101,
    isCustom: false,
    color: '#3560bf',
    blockExplorer: makeExplorer({
      name: 'Etherinc Explorer',
      origin: 'https://explorer.einc.io'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETI_DEFAULT,
      [WalletId.SAFE_T_MINI]: DPaths.ETI_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ETI_DEFAULT
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
    unit: 'ASK' as TSymbol,
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
    dPaths: {
      [WalletId.TREZOR]: DPaths.ASK_TREZOR,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ASK_DEFAULT
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
    unit: 'AUX' as TSymbol,
    chainId: 28945486,
    isCustom: false,
    color: '#85dc35',
    blockExplorer: makeExplorer({
      name: 'Auxilium Explore',
      origin: 'https://explore.auxilium.global/'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.SAFE_T_MINI]: DPaths.AUX_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.AUX_DEFAULT
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
    unit: 'ERE' as TSymbol,
    chainId: 466,
    isCustom: false,
    color: '#3a6ea7',
    blockExplorer: makeExplorer({
      name: 'EtherCore Explorer',
      origin: 'https://explorer.ethercore.io'
    }),
    tokens: [],
    contracts: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ERE_DEFAULT,
      [WalletId.MNEMONIC_PHRASE]: DPaths.ERE_DEFAULT
    },
    gasPriceSettings: {
      min: 0.1,
      max: 60,
      initial: 1
    }
  }
};
