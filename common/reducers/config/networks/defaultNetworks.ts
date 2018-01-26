import { ethPlorer, ETHTokenExplorer, SecureWalletName, InsecureWalletName } from 'config/data';
import {
  ETH_DEFAULT,
  ETH_TREZOR,
  ETH_LEDGER,
  ETC_LEDGER,
  ETC_TREZOR,
  ETH_TESTNET,
  EXP_DEFAULT,
  UBQ_DEFAULT
} from 'config/dpaths';
import {
  NetworkConfig,
  BlockExplorerConfig,
  DefaultNetworkNames
} from 'reducers/config/networks/typings';
import { ConfigAction } from 'actions/config';

export type State = { [key in DefaultNetworkNames]: NetworkConfig };

// Must be a website that follows the ethplorer convention of /tx/[hash] and
// address/[address] to generate the correct functions.
// TODO: put this in utils / libs
function makeExplorer(origin: string): BlockExplorerConfig {
  return {
    origin,
    txUrl: hash => `${origin}/tx/${hash}`,
    addressUrl: address => `${origin}/address/${address}`
  };
}

const INITIAL_STATE: State = {
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
    contracts: require('./contracts/eth.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TREZOR,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_DEFAULT
    }
  },
  Ropsten: {
    name: 'Ropsten',
    unit: 'ETH',
    chainId: 3,
    color: '#adc101',
    blockExplorer: makeExplorer('https://ropsten.etherscan.io'),
    tokens: require('./tokens/ropsten.json'),
    contracts: require('./contracts/ropsten.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: ETH_TESTNET,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
    }
  },
  Kovan: {
    name: 'Kovan',
    unit: 'ETH',
    chainId: 42,
    color: '#adc101',
    blockExplorer: makeExplorer('https://kovan.etherscan.io'),
    tokens: require('./tokens/ropsten.json'),
    contracts: require('./contracts/ropsten.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: ETH_TESTNET,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
    }
  },
  Rinkeby: {
    name: 'Rinkeby',
    unit: 'ETH',
    chainId: 4,
    color: '#adc101',
    blockExplorer: makeExplorer('https://rinkeby.etherscan.io'),
    tokens: require('./tokens/rinkeby.json'),
    contracts: require('./contracts/rinkeby.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: ETH_TESTNET,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
    }
  },
  ETC: {
    name: 'ETC',
    unit: 'ETC',
    chainId: 61,
    color: '#669073',
    blockExplorer: makeExplorer('https://gastracker.io'),
    tokens: require('./tokens/etc.json'),
    contracts: require('./contracts/etc.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETC_TREZOR,
      [SecureWalletName.LEDGER_NANO_S]: ETC_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETC_TREZOR
    }
  },
  UBQ: {
    name: 'UBQ',
    unit: 'UBQ',
    chainId: 8,
    color: '#b37aff',
    blockExplorer: makeExplorer('https://ubiqscan.io/en'),
    tokens: require('./tokens/ubq.json'),
    contracts: require('./contracts/ubq.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: UBQ_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: UBQ_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: UBQ_DEFAULT
    }
  },
  EXP: {
    name: 'EXP',
    unit: 'EXP',
    chainId: 2,
    color: '#673ab7',
    blockExplorer: makeExplorer('http://www.gander.tech'),
    tokens: require('./tokens/exp.json'),
    contracts: require('./contracts/exp.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: EXP_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: EXP_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: EXP_DEFAULT
    }
  }
};

export const defaultNetworks = (state: State = INITIAL_STATE, action: ConfigAction) => {
  switch (action.type) {
    default:
      return state;
  }
};
