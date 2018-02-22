import { staticNetworks, makeExplorer } from 'reducers/config/networks/staticNetworks';
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

const expectedInitialState = {
  ETH: {
    name: 'ETH',
    unit: 'ETH',
    chainId: 1,
    isCustom: false,
    color: '#0e97c0',
    blockExplorer: makeExplorer('Etherscan', 'https://etherscan.io'),
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
    }
  },
  Ropsten: {
    name: 'Ropsten',
    unit: 'ETH',
    chainId: 3,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer('Etherscan', 'https://ropsten.etherscan.io'),
    tokens: require('config/tokens/ropsten.json'),
    contracts: require('config/contracts/ropsten.json'),
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
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer('Etherscan', 'https://kovan.etherscan.io'),
    tokens: require('config/tokens/ropsten.json'),
    contracts: require('config/contracts/ropsten.json'),
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
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer('Etherscan', 'https://rinkeby.etherscan.io'),
    tokens: require('config/tokens/rinkeby.json'),
    contracts: require('config/contracts/rinkeby.json'),
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
    isCustom: false,
    color: '#669073',
    blockExplorer: makeExplorer('GasTracker', 'https://gastracker.io'),
    tokens: require('config/tokens/etc.json'),
    contracts: require('config/contracts/etc.json'),
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
    isCustom: false,
    color: '#b37aff',
    blockExplorer: makeExplorer('Ubiqscan', 'https://ubiqscan.io/en'),
    tokens: require('config/tokens/ubq.json'),
    contracts: require('config/contracts/ubq.json'),
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
    isCustom: false,
    color: '#673ab7',
    blockExplorer: makeExplorer('Gander', 'https://www.gander.tech'),
    tokens: require('config/tokens/exp.json'),
    contracts: require('config/contracts/exp.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: EXP_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: EXP_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: EXP_DEFAULT
    }
  }
};

const expectedState = {
  initialState: expectedInitialState
};

describe('Testing contained data', () => {
  it(`contain unique chainIds`, () => {
    const networkValues = Object.values(expectedInitialState);
    const chainIds = networkValues.map(a => a.chainId);
    const chainIdsSet = new Set(chainIds);
    expect(Array.from(chainIdsSet).length).toEqual(chainIds.length);
  });
});

describe('static networks reducer', () => {
  it('should return the initial state', () =>
    expect(JSON.stringify(staticNetworks(undefined, {} as any))).toEqual(
      JSON.stringify(expectedState.initialState)
    ));
});

export { expectedState as staticNetworksExpectedState };
