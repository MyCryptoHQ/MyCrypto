import {
  DEFAULT_NETWORK,
  DEFAULT_NETWORK_TICKER,
  DPathsList as DPaths,
  ETHPLORER_URL,
  GAS_PRICE_DEFAULT,
  GAS_PRICE_TESTNET
} from '@config';
import { Network, NetworkId, TTicker, WalletId } from '@types';
import { generateAssetUUID } from '@utils';
import { makeExplorer } from '@utils/makeExplorer'; // leads to circular dependency if importing from base utils dir

/**
 * Configuration file for app networks.
 * When used in the app it augmented with contracts, assets, and nodes.
 * It should NEVER be accessed directly inside the app.
 * You access networks through the store.
 */
export const NETWORKS_CONFIG: Record<NetworkId, Network> = {
  Ethereum: {
    id: DEFAULT_NETWORK,
    name: 'Ethereum',
    baseUnit: DEFAULT_NETWORK_TICKER,
    baseAsset: generateAssetUUID(1),
    chainId: 1,
    isCustom: false,
    isTestnet: false,
    color: '#007896',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://etherscan.io'
    }),
    tokenExplorer: makeExplorer({
      name: 'EthPlorer',
      origin: ETHPLORER_URL
    }),
    assets: [],
    nodes: [],
    contracts: [], // require('./contracts/eth.json'),
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TREZOR,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.TREZOR_NEW]: DPaths.ETH_TREZOR,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_LEDGER,
      default: DPaths.ETH_DEFAULT
    },
    gasPriceSettings: GAS_PRICE_DEFAULT,
    shouldEstimateGasPrice: true
  },
  Ropsten: {
    id: 'Ropsten',
    name: 'Ropsten',
    baseUnit: 'RopstenETH' as TTicker,
    baseAsset: generateAssetUUID(3),
    chainId: 3,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://ropsten.etherscan.io'
    }),
    assets: [],
    nodes: [],
    contracts: [], // require('./contracts/ropsten.json'),
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.TREZOR_NEW]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_LEDGER,
      default: DPaths.ETH_TESTNET
    },
    gasPriceSettings: GAS_PRICE_TESTNET
  },
  Kovan: {
    id: 'Kovan',
    name: 'Kovan',
    baseUnit: 'KovanETH' as TTicker,
    baseAsset: generateAssetUUID(42),
    chainId: 42,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://kovan.etherscan.io'
    }),
    assets: [],
    nodes: [],
    contracts: [], // require('./contracts/kovan.json'),
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.TREZOR_NEW]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_LEDGER,
      default: DPaths.ETH_TESTNET
    },
    gasPriceSettings: GAS_PRICE_DEFAULT
  },
  Rinkeby: {
    id: 'Rinkeby',
    name: 'Rinkeby',
    baseUnit: 'RinkebyETH' as TTicker,
    baseAsset: generateAssetUUID(4),
    chainId: 4,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://rinkeby.etherscan.io'
    }),
    assets: [],
    contracts: [], // require('./contracts/rinkeby.json'),
    nodes: [],
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.TREZOR_NEW]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_LEDGER,
      default: DPaths.ETH_TESTNET
    },
    gasPriceSettings: GAS_PRICE_TESTNET
  },
  Goerli: {
    id: 'Goerli',
    name: 'Goerli',
    baseUnit: 'GoerliETH' as TTicker,
    baseAsset: generateAssetUUID(5),
    chainId: 5,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://goerli.etherscan.io/'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.TREZOR_NEW]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_LEDGER,
      default: DPaths.ETH_TESTNET
    },
    gasPriceSettings: GAS_PRICE_TESTNET
  },
  ETC: {
    id: 'ETC',
    name: 'Ethereum Classic',
    baseUnit: 'ETC' as TTicker,
    baseAsset: generateAssetUUID(61),
    chainId: 61,
    isCustom: false,
    color: '#669073',
    blockExplorer: makeExplorer({
      name: 'BlockScout',
      origin: 'https://blockscout.com/etc/mainnet',
      addressPath: 'address'
    }),
    assets: [],
    contracts: [], // require('./contracts/etc.json'),
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETC_TREZOR,
      [WalletId.LEDGER_NANO_S]: DPaths.ETC_LEDGER,
      [WalletId.TREZOR_NEW]: DPaths.ETC_TREZOR,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETC_LEDGER,
      default: DPaths.ETC_LEDGER
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
    baseUnit: 'UBQ' as TTicker,
    baseAsset: generateAssetUUID(8),
    chainId: 8,
    isCustom: false,
    color: '#b37aff',
    blockExplorer: makeExplorer({
      name: 'Ubiqscan',
      origin: 'https://ubiqscan.io'
    }),
    assets: [],
    nodes: [],
    contracts: [], // require('./contracts/ubq.json'),
    dPaths: {
      [WalletId.TREZOR]: DPaths.UBQ_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.UBQ_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.UBQ_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.UBQ_DEFAULT,
      default: DPaths.UBQ_DEFAULT
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
    baseUnit: 'EXP' as TTicker,
    baseAsset: generateAssetUUID(2),
    chainId: 2,
    isCustom: false,
    color: '#673ab7',
    blockExplorer: makeExplorer({
      name: 'Gander',
      origin: 'https://www.gander.tech'
    }),
    assets: [],
    contracts: [], // require('./contracts/exp.json'),
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.EXP_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.EXP_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.EXP_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.EXP_DEFAULT,
      default: DPaths.EXP_DEFAULT
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
    baseUnit: 'POA' as TTicker,
    baseAsset: generateAssetUUID(99),
    chainId: 99,
    isCustom: false,
    color: '#6d2eae',
    blockExplorer: makeExplorer({
      name: 'BlockScout',
      origin: 'https://blockscout.com/poa/core',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.POA_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.TREZOR_NEW]: DPaths.POA_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_LEDGER,
      default: DPaths.POA_DEFAULT
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
    baseUnit: 'TOMO' as TTicker,
    baseAsset: generateAssetUUID(88),
    chainId: 88,
    isCustom: false,
    color: '#6a488d',
    blockExplorer: makeExplorer({
      name: 'Tomochain Explorer',
      origin: 'https://scan.tomochain.com'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TREZOR,
      [WalletId.LEDGER_NANO_S]: DPaths.TOMO_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.ETH_TREZOR,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.TOMO_DEFAULT,
      default: DPaths.TOMO_DEFAULT
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
    baseUnit: 'MUSIC' as TTicker,
    baseAsset: generateAssetUUID(7762959),
    chainId: 7762959,
    isCustom: false,
    color: '#ffbb00',
    blockExplorer: makeExplorer({
      name: 'Musicoin Explorer',
      origin: 'https://explorer.musicoin.org',
      addressPath: 'account'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.MUSIC_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.MUSIC_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.MUSIC_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.MUSIC_DEFAULT,
      default: DPaths.MUSIC_DEFAULT
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
    baseUnit: 'EGEM' as TTicker,
    baseAsset: generateAssetUUID(1987),
    chainId: 1987,
    isCustom: false,
    color: '#D0F7FF',
    blockExplorer: makeExplorer({
      name: 'EtherGem Explorer',
      origin: 'https://explorer.egem.io'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.EGEM_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.EGEM_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.EGEM_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.EGEM_DEFAULT,
      default: DPaths.EGEM_DEFAULT
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
    baseUnit: 'CLO' as TTicker,
    baseAsset: generateAssetUUID(820),
    chainId: 820,
    isCustom: false,
    color: '#00b04a',
    blockExplorer: makeExplorer({
      name: 'Callisto Explorer',
      origin: 'https://explorer.callisto.network'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.CLO_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.CLO_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.CLO_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.CLO_DEFAULT,
      default: DPaths.CLO_DEFAULT
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
    baseUnit: 'RBTC' as TTicker,
    baseAsset: generateAssetUUID(30),
    chainId: 30,
    color: '#58A052',
    isCustom: false,
    blockExplorer: makeExplorer({
      name: 'RSK Explorer',
      origin: 'https://explorer.rsk.co'
    }),
    assets: [],
    nodes: [],
    contracts: [], // require('./contracts/rsk.json'),
    isTestnet: false,
    dPaths: {
      [WalletId.TREZOR]: DPaths.RSK_MAINNET,
      [WalletId.LEDGER_NANO_S]: DPaths.RSK_MAINNET,
      [WalletId.TREZOR_NEW]: DPaths.RSK_MAINNET,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.RSK_MAINNET,
      default: DPaths.RSK_MAINNET
    },
    gasPriceSettings: {
      min: 0.06,
      max: 1.5,
      initial: 0.06
    }
    //unsupportedTabs: [TAB.ENS],
  },

  RSK_TESTNET: {
    id: 'RSK_TESTNET',
    name: 'RSK Testnet',
    baseUnit: 'RBTC' as TTicker,
    baseAsset: generateAssetUUID(31),
    chainId: 31,
    color: '#58A052',
    isCustom: false,
    blockExplorer: makeExplorer({
      name: 'RSK Testnet Explorer',
      origin: 'https://explorer.testnet.rsk.co'
    }),
    assets: [],
    nodes: [],
    contracts: [], // require('./contracts/rsk_testnet.json'),
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.RSK_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.RSK_TESTNET,
      [WalletId.TREZOR_NEW]: DPaths.RSK_TESTNET,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.RSK_TESTNET,
      default: DPaths.RSK_TESTNET
    },
    gasPriceSettings: {
      min: 0.06,
      max: 1.5,
      initial: 0.06
    }
  },

  GO: {
    id: 'GO',
    name: 'GO',
    baseUnit: 'GO' as TTicker,
    baseAsset: generateAssetUUID(60),
    chainId: 60,
    isCustom: false,
    color: '#00b04a',
    blockExplorer: makeExplorer({
      name: 'GoChain Explorer',
      origin: 'https://explorer.gochain.io'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.GO_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.GO_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.GO_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.GO_DEFAULT,
      default: DPaths.GO_DEFAULT
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
    baseUnit: 'GO' as TTicker,
    baseAsset: generateAssetUUID(31337),
    chainId: 31337,
    isCustom: false,
    color: '#00b04a',
    blockExplorer: makeExplorer({
      name: 'GoChain Testnet Explorer',
      origin: 'https://testnet-explorer.gochain.io'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.GO_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.GO_DEFAULT,
      default: DPaths.GO_DEFAULT
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
    baseUnit: 'ESN' as TTicker,
    baseAsset: generateAssetUUID(31102),
    chainId: 31102,
    isCustom: false,
    color: '#7a56ad',
    blockExplorer: makeExplorer({
      name: 'ESN Explorer',
      origin: 'https://ethersocial.net'
    }),
    assets: [],
    contracts: [], // require('./contracts/esn.json'),
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ESN_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.ESN_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.ESN_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ESN_DEFAULT,
      default: DPaths.ESN_DEFAULT
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
    baseUnit: 'AQUA' as TTicker,
    baseAsset: generateAssetUUID(61717561),
    chainId: 61717561,
    isCustom: false,
    color: '#00ffff',
    blockExplorer: makeExplorer({
      name: 'AQUA Explorer',
      origin: 'https://blockscout.aqua.signal2noi.se'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.ETH_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_DEFAULT,
      default: DPaths.ETH_DEFAULT
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
    baseUnit: 'AKA' as TTicker,
    baseAsset: generateAssetUUID(200625),
    chainId: 200625,
    isCustom: false,
    color: '#aa0087',
    blockExplorer: makeExplorer({
      name: 'Akroma Explorer',
      origin: 'https://explorer.akroma.io'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.AKA_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.AKA_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.AKA_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.AKA_DEFAULT,
      default: DPaths.AKA_DEFAULT
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
    baseUnit: 'PIRL' as TTicker,
    baseAsset: generateAssetUUID(3125659152),
    chainId: 3125659152,
    isCustom: false,
    color: '#a2d729',
    blockExplorer: makeExplorer({
      name: 'Pirl Poseidon Explorer',
      origin: 'https://devexplorer.pirl.io'
    }),
    assets: [],
    contracts: [], // require('./contracts/pirl.json'),
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.PIRL_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.PIRL_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.PIRL_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.PIRL_DEFAULT,
      default: DPaths.PIRL_DEFAULT
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
    baseUnit: 'ATH' as TTicker,
    baseAsset: generateAssetUUID(1620),
    chainId: 1620,
    isCustom: false,
    color: '#0093c5',
    blockExplorer: makeExplorer({
      name: 'Atheios Explorer',
      origin: 'https://explorer.atheios.com'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ATH_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.ATH_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.ATH_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ATH_DEFAULT,
      default: DPaths.ATH_DEFAULT
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
    baseUnit: 'ETHO' as TTicker,
    baseAsset: generateAssetUUID(1313114),
    chainId: 1313114,
    isCustom: false,
    color: '#7a1336',
    blockExplorer: makeExplorer({
      name: 'Ether-1 Explorer',
      origin: 'https://explorer.ether1.org'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETHO_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.ETHO_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.ETHO_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETHO_DEFAULT,
      default: DPaths.ETHO_DEFAULT
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
    baseUnit: 'MIX' as TTicker,
    baseAsset: generateAssetUUID(76),
    chainId: 76,
    isCustom: false,
    color: '#e59b2b',
    blockExplorer: makeExplorer({
      name: 'MIX Blockchain Explorer',
      origin: 'https://blocks.mix-blockchain.org'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.MIX_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.MIX_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.MIX_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.MIX_DEFAULT,
      default: DPaths.MIX_DEFAULT
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
    baseUnit: 'REOSC' as TTicker,
    baseAsset: generateAssetUUID(2894),
    chainId: 2894,
    isCustom: false,
    color: '#1500db',
    blockExplorer: makeExplorer({
      name: 'REOSC Explorer',
      origin: 'https://explorer.reosc.io'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.REOSC_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.REOSC_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.REOSC_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.REOSC_DEFAULT,
      default: DPaths.REOSC_DEFAULT
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
    baseUnit: 'ATS' as TTicker,
    baseAsset: generateAssetUUID(246529),
    chainId: 246529,
    isCustom: false,
    color: '#238006',
    blockExplorer: makeExplorer({
      name: 'BlockScout',
      origin: 'https://explorer.sigma1.artis.network',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    isTestnet: false,
    dPaths: {
      [WalletId.TREZOR]: DPaths.ARTIS_SIGMA1,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.TREZOR_NEW]: DPaths.ARTIS_SIGMA1,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_LEDGER,
      default: DPaths.ARTIS_SIGMA1
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
    baseUnit: 'ATS' as TTicker,
    baseAsset: generateAssetUUID(246785),
    chainId: 246785,
    isCustom: false,
    color: '#238006',
    blockExplorer: makeExplorer({
      name: 'BlockScout',
      origin: 'https://explorer.tau1.artis.network',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    isTestnet: true,
    dPaths: {
      [WalletId.TREZOR]: DPaths.ARTIS_TAU1,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.TREZOR_NEW]: DPaths.ARTIS_TAU1,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_LEDGER,
      default: DPaths.ARTIS_TAU1
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
    baseUnit: 'TT' as TTicker,
    baseAsset: generateAssetUUID(108),
    chainId: 108,
    isCustom: false,
    color: '#ffc000',
    blockExplorer: makeExplorer({
      name: 'ThunderScan',
      origin: 'https://scan.thundercore.com'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.LEDGER_NANO_S]: DPaths.THUNDERCORE_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.THUNDERCORE_DEFAULT,
      default: DPaths.THUNDERCORE_DEFAULT
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
    baseUnit: 'WEB' as TTicker,
    baseAsset: generateAssetUUID(24484),
    chainId: 24484,
    isCustom: false,
    color: '#0092ee',
    blockExplorer: makeExplorer({
      name: 'Webchain Explorer',
      origin: 'https://explorer.webchain.network'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      default: DPaths.WEB_DEFAULT
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
    baseUnit: 'META' as TTicker,
    baseAsset: generateAssetUUID(11),
    chainId: 11,
    isCustom: false,
    color: '#ffc000',
    blockExplorer: makeExplorer({
      name: 'Metadium Explorer',
      origin: 'https://explorer.metadium.com/'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_LEDGER,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_LEDGER,
      default: DPaths.METADIUM_DEFAULT
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
    baseUnit: 'DXN' as TTicker,
    baseAsset: generateAssetUUID(237),
    chainId: 237,
    isCustom: false,
    color: '#954a97',
    blockExplorer: makeExplorer({
      name: 'DEXON Scan',
      origin: 'https://dexonscan.app',
      txPath: 'transaction'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.LEDGER_NANO_S]: DPaths.DEXON_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.DEXON_DEFAULT,
      default: DPaths.DEXON_DEFAULT
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
    baseUnit: 'ETI' as TTicker,
    baseAsset: generateAssetUUID(101),
    chainId: 101,
    isCustom: false,
    color: '#3560bf',
    blockExplorer: makeExplorer({
      name: 'Etherinc Explorer',
      origin: 'https://explorer.einc.io'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETI_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.ETI_DEFAULT,
      default: DPaths.ETI_DEFAULT
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
    baseUnit: 'ASK' as TTicker,
    baseAsset: generateAssetUUID(222),
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
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ASK_TREZOR,
      [WalletId.TREZOR_NEW]: DPaths.ASK_TREZOR,
      default: DPaths.ASK_DEFAULT
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
    baseUnit: 'AUX' as TTicker,
    baseAsset: generateAssetUUID(28945486),
    chainId: 28945486,
    isCustom: false,
    color: '#85dc35',
    blockExplorer: makeExplorer({
      name: 'Auxilium Explore',
      origin: 'https://explore.auxilium.global/'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      default: DPaths.AUX_DEFAULT
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
    baseUnit: 'ERE' as TTicker,
    baseAsset: generateAssetUUID(466),
    chainId: 466,
    isCustom: false,
    color: '#3a6ea7',
    blockExplorer: makeExplorer({
      name: 'EtherCore Explorer',
      origin: 'https://explorer.ethercore.io'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ERE_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.ERE_DEFAULT,
      default: DPaths.ERE_DEFAULT
    },
    gasPriceSettings: {
      min: 0.1,
      max: 60,
      initial: 1
    }
  },
  VOLTA: {
    id: 'VOLTA',
    name: 'Volta',
    baseUnit: 'VT' as TTicker,
    baseAsset: generateAssetUUID(73799),
    chainId: 73799,
    isCustom: false,
    color: '#6d2eae',
    blockExplorer: makeExplorer({
      name: 'Energy Web VOLTA Explorer',
      origin: 'https://volta-explorer.energyweb.org',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.VOLTA_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.VOLTA_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.VOLTA_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.VOLTA_DEFAULT,
      default: DPaths.VOLTA_DEFAULT
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
    baseUnit: 'EWT' as TTicker,
    baseAsset: generateAssetUUID(246),
    chainId: 246,
    isCustom: false,
    color: '#6d2eae',
    blockExplorer: makeExplorer({
      name: 'Energy Web Chain Explorer',
      origin: 'https://explorer.energyweb.org',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.EWC_DEFAULT,
      [WalletId.LEDGER_NANO_S]: DPaths.EWC_DEFAULT,
      [WalletId.TREZOR_NEW]: DPaths.EWC_DEFAULT,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.EWC_DEFAULT,
      default: DPaths.EWC_DEFAULT
    },
    gasPriceSettings: {
      min: 0.01,
      max: 10,
      initial: 0.01
    }
  },
  HARDLYDIFFICULT: {
    id: 'HARDLYDIFFICULT',
    name: 'HardlyDifficult',
    baseUnit: 'HD' as TTicker,
    baseAsset: generateAssetUUID(666),
    chainId: 666,
    isCustom: false,
    color: '#282457',
    blockExplorer: makeExplorer({
      name: 'HardlyDifficult Explorer',
      origin: 'https://etherscan.io',
      addressPath: 'address',
      blockPath: 'blocks'
    }),
    assets: [],
    contracts: [],
    nodes: [],
    dPaths: {
      [WalletId.TREZOR]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S]: DPaths.ETH_TESTNET,
      [WalletId.TREZOR_NEW]: DPaths.ETH_TESTNET,
      [WalletId.LEDGER_NANO_S_NEW]: DPaths.ETH_TESTNET,
      default: DPaths.ETH_TESTNET
    },
    gasPriceSettings: {
      min: 1,
      max: 100,
      initial: 1
    },
    shouldEstimateGasPrice: false
  }
};