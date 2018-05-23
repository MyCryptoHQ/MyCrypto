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
  UBQ_DEFAULT
} from 'config/dpaths';
import { TypeKeys, UpdateTokensAction } from 'actions/config';
import { makeExplorer } from 'utils/helpers';
import { StaticNetworksState as State } from './types';
import { StaticNetworkConfig } from 'shared/types/network';

const testnetDefaultGasPrice = {
  min: 0.1,
  max: 40,
  initial: 4
};

export const INITIAL_STATE: State = {
  ETH: {
    name: 'ETH',
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
    updatingTokens: false,
    shouldCheckForTokenUpdates: true,
    tokenListHash: '',
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
    updatingTokens: false,
    shouldCheckForTokenUpdates: true,
    tokenListHash: '',
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
    updatingTokens: false,
    shouldCheckForTokenUpdates: true,
    tokenListHash: '',
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
    updatingTokens: false,
    shouldCheckForTokenUpdates: true,
    tokenListHash: '',
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
    name: 'ETC',
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
    updatingTokens: false,
    shouldCheckForTokenUpdates: true,
    tokenListHash: '',
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
    name: 'UBQ',
    unit: 'UBQ',
    chainId: 8,
    isCustom: false,
    color: '#b37aff',
    blockExplorer: makeExplorer({
      name: 'Ubiqscan',
      origin: 'https://ubiqscan.io/en'
    }),
    tokens: require('config/tokens/ubq.json'),
    updatingTokens: false,
    shouldCheckForTokenUpdates: true,
    tokenListHash: '',
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
    name: 'EXP',
    unit: 'EXP',
    chainId: 2,
    isCustom: false,
    color: '#673ab7',
    blockExplorer: makeExplorer({
      name: 'Gander',
      origin: 'https://www.gander.tech'
    }),
    tokens: require('config/tokens/exp.json'),
    updatingTokens: false,
    shouldCheckForTokenUpdates: true,
    tokenListHash: '',
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
    updatingTokens: false,
    shouldCheckForTokenUpdates: false,
    tokenListHash: '',
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
    name: 'TOMO',
    unit: 'TOMO',
    chainId: 40686,
    isCustom: false,
    color: '#6a488d',
    blockExplorer: makeExplorer({
      name: 'Tomochain Explorer',
      origin: 'https://explorer.tomocoin.io/#'
    }),
    tokens: [],
    updatingTokens: false,
    shouldCheckForTokenUpdates: false,
    tokenListHash: '',
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
    name: 'ELLA',
    unit: 'ELLA',
    chainId: 64,
    isCustom: false,
    color: '#046111',
    blockExplorer: makeExplorer({
      name: 'Ellaism Explorer',
      origin: 'https://explorer.ellaism.org'
    }),
    tokens: [],
    updatingTokens: false,
    shouldCheckForTokenUpdates: false,
    tokenListHash: '',
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
  }
};

function networkReducerHelper(state: State, action: UpdateTokensAction) {
  const { payload } = action;
  const networkId = payload.id;
  const networkToUpdate = state[networkId];
  return { networkId, networkToUpdate, payload };
}

export const staticNetworks = (state: State = INITIAL_STATE, action: UpdateTokensAction) => {
  switch (action.type) {
    case TypeKeys.CONFIG_UPDATE_TOKENS_REQUESTED: {
      const { networkId, networkToUpdate } = networkReducerHelper(state, action);
      const nextNetwork: StaticNetworkConfig = { ...networkToUpdate, updatingTokens: true };

      return { ...state, [networkId]: nextNetwork };
    }

    case TypeKeys.CONFIG_UPDATE_TOKENS_SUCCEEDED: {
      const { networkId, networkToUpdate } = networkReducerHelper(state, action);
      const { tokens, hash } = action.payload;

      const nextNetwork: StaticNetworkConfig = {
        ...networkToUpdate,
        updatingTokens: false,
        tokens,
        tokenListHash: hash || networkToUpdate.tokenListHash
      };

      return { ...state, [networkId]: nextNetwork };
    }

    case TypeKeys.CONFIG_UDPATE_TOKENS_FAILED: {
      const { networkId, networkToUpdate } = networkReducerHelper(state, action);
      const nextNetwork: StaticNetworkConfig = { ...networkToUpdate, updatingTokens: false };

      return { ...state, [networkId]: nextNetwork };
    }
    default:
      return state;
  }
};
