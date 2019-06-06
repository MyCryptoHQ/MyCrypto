import * as serviceTypes from 'v2/services/types';
import { SecureWalletName } from 'config/data';
import { InsecureWalletName } from 'v2/features/Wallets/types';
import { ETH_DEFAULT } from 'config/dpaths';

export const CACHE_KEY = 'MyCryptoCache';
export const ENCRYPTED_CACHE_KEY = 'ENCRYPTED_CACHE';

export interface LocalCache {
  currents: serviceTypes.Currents;
  globalSettings: Partial<serviceTypes.GlobalSettings>;
  recentAccounts: string[];
  accounts: Record<string, serviceTypes.Account>;
  accountTypes: Record<string, serviceTypes.AccountType>;
  assets: Record<string, serviceTypes.Asset>;
  networks: Record<string, serviceTypes.Network>;
  nodeOptions: Record<string, serviceTypes.NodeOptions>;
  contracts: Record<string, serviceTypes.Contract>;
  derivationPathOptions: Record<string, serviceTypes.DerivationPathOptions>;
  addressMetadata: Record<string, serviceTypes.AddressMetadata>;
  notifications: Record<string, serviceTypes.Notification>;
  fiatCurrencies: Record<string, serviceTypes.FiatCurrency>;
  screenLockSettings?: Partial<serviceTypes.ScreenLockSettings>;
}

export const CACHE_INIT_DEV: LocalCache = {
  currents: {
    accounts: ['61d84f5e-0efa-46b9-915c-aed6ebe5a4dc'],
    fiatCurrency: 'USD',
    activeWallet: 'all',
    node: 'eth_mycrypto',
    network: 'ETH'
  },
  recentAccounts: ['61d84f5e-0efa-46b9-915c-aed6ebe5a4dc'],
  globalSettings: {
    fiatCurrency: 'USD',
    darkMode: true
  },
  accounts: {
    '61d84f5e-0efa-46b9-915c-aed6ebe5a4dc': {
      label: 'Foo',
      address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      network: 'ETH',
      assets: [{ uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a', balance: '0' }],
      wallet: SecureWalletName.WEB3,
      balance: 1e18,
      transactions: [
        {
          txHash: '0xf1e4e01312c3e465376cc6eeed1138d5a870363e1a1a88f54473801b214d3a69',
          stage: 'pending',
          label: 'Example',
          date: 1547768373,
          value: 0,
          from: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
          to: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
          fiatValue: {
            USD: '0'
          }
        }
      ],
      dPath: `m/44'/60'/0'/0/0`,
      timestamp: Date.now()
    }
  },
  accountTypes: {
    MetaMask: {
      name: 'MetaMask',
      key: 'metamask',
      secure: true,
      derivationPath: '',
      web3: true,
      hardware: false
    }
  },
  assets: {
    '12d3cbf2-de3a-4050-a0c6-521592e4b85a': {
      uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a',
      name: 'Ethereum',
      networkId: 'ETH',
      type: 'base',
      ticker: 'ETH',
      decimal: 18,
      contractAddress: null
    },
    '10e14757-78bb-4bb2-a17a-8333830f6698': {
      uuid: '10e14757-78bb-4bb2-a17a-8333830f6698',
      name: 'OmiseGo',
      networkId: 'ETH',
      type: 'erc20',
      ticker: 'OMG',
      contractAddress: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
      decimal: 18
    }
  },
  networks: {
    ETH: {
      id: 'ETH',
      name: 'Ethereum',
      baseAsset: '12d3cbf2-de3a-4050-a0c6-521592e4b85a',
      unit: 'ETH',
      chainId: 1,
      isCustom: false,
      color: '#007896',
      blockExplorer: {},
      tokenExplorer: {},
      tokens: [],
      contracts: ['17ed6f49-ff23-4bef-a676-69174c266b38'],
      nodes: ['eth_mycrypto'],
      dPathFormats: {
        [InsecureWalletName.MNEMONIC_PHRASE]: ETH_DEFAULT
      },
      gasPriceSettings: {
        min: 1,
        max: 100,
        initial: 15
      },
      shouldEstimateGasPrice: true,
      assets: []
    }
  },
  nodeOptions: {
    eth_mycrypto: {
      name: 'eth_mycrypto',
      type: 'rpc',
      service: 'MyCrypto',
      url: 'https://api.mycryptoapi.com/eth'
    }
  },
  contracts: {
    '17ed6f49-ff23-4bef-a676-69174c266b38': {
      name: 'Athenian: Warrior for Battle',
      networkId: 'ETH',
      address: '0x17052d51E954592C1046320c2371AbaB6C73Ef10',
      abi:
        '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"},{"name":"tokenSupply","type":"uint256"}],"name":"SetupToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"adr","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]'
    }
  },
  derivationPathOptions: {},
  addressMetadata: {
    '0x80200997f095da94e404f7e0d581aab1ffba9f7d': {
      address: '0x80200997f095da94e404f7e0d581aab1ffba9f7d',
      label: 'My Wallet',
      notes: 'This is my wallet.'
    }
  },
  notifications: {},
  fiatCurrencies: {
    USD: {
      code: 'USD',
      name: 'US Dollars'
    }
  }
};

export const CACHE_INIT: LocalCache = {
  // : LocalCache
  currents: {
    accounts: []
  },
  recentAccounts: [],
  globalSettings: {},
  accounts: {},
  accountTypes: {},
  assets: {},
  networks: {},
  nodeOptions: {},
  contracts: {},
  derivationPathOptions: {},
  addressMetadata: {},
  notifications: {},
  fiatCurrencies: {}
};
