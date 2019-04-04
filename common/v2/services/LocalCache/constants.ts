import * as serviceTypes from 'v2/services/types';

export const CACHE_KEY = 'MyCryptoCache';

export interface LocalCache {
  currents: Partial<serviceTypes.Currents>;

  globalSettings: Partial<serviceTypes.GlobalSettings>;

  recentAccounts: string[];

  accounts: Record<string, serviceTypes.Account>;
  allAccounts: string[];

  transactionHistories: Record<string, serviceTypes.TransactionHistory>;
  allTransactionHistories: string[];

  transactions: Record<string, serviceTypes.Transaction>;
  allTransactions: string[];

  accountTypes: Record<string, serviceTypes.AccountType>;
  allAccountTypes: string[];

  assets: Record<string, serviceTypes.Asset>;
  allAssets: string[];

  localSettings: Record<string, serviceTypes.LocalSetting>;
  allLocalSettings: string[];

  networkOptions: Record<string, serviceTypes.NetworkOptions>;
  allNetworkOptions: string[];

  nodeOptions: Record<string, serviceTypes.NodeOptions>;
  allNodeOptions: string[];

  assetOptions: Record<string, serviceTypes.AssetOption>;
  allAssetOptions: string[];

  contractOptions: Record<string, serviceTypes.ContractOptions>;
  allContractOptions: string[];

  derivationPathOptions: Record<string, serviceTypes.DerivationPathOptions>;
  allDerivationPathOptions: string[];

  addressMetadata: Record<string, serviceTypes.AddressMetadata>;
  allAddressMetadata: string[];

  activeNotifications: Record<string, serviceTypes.ActiveNotifications>;
  allActiveNotifications: string[];

  fiatCurrencies: Record<string, serviceTypes.FiatCurrency>;
  allFiatCurrencies: string[];

  password?: string;
}

export const CACHE_INIT_DEV: LocalCache = {
  currents: {
    account: ['61d84f5e-0efa-46b9-915c-aed6ebe5a4dc'],
    fiatCurrency: 'USD',
    activeWallet: 'all'
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
      network: 'Ethereum',
      localSettings: '17ed6f49-ff23-4bef-a676-69174c266b37',
      assets: '12d3cbf2-de3a-4050-a0c6-521592e4b85a',
      accountType: 'MetaMask',
      value: 1e18,
      transactionHistory: '76b50f76-afb2-4185-ab7d-4d62c0654882'
    }
  },
  allAccounts: ['61d84f5e-0efa-46b9-915c-aed6ebe5a4dc'],

  transactionHistories: {
    '6e1c322c-aea6-4484-8fdc-7b3227a9d359': {
      transaction: '6e1c322c-aea6-4484-8fdc-7b3227a9d359'
    },
    '76b50f76-afb2-4185-ab7d-4d62c0654881': {
      transaction: '76b50f76-afb2-4185-ab7d-4d62c0654881'
    },
    '76b50f76-afb2-4185-ab7d-4d62c0654885': {
      transaction: '76b50f76-afb2-4185-ab7d-4d62c0654885'
    }
  },
  allTransactionHistories: [
    '6e1c322c-aea6-4484-8fdc-7b3227a9d359',
    '76b50f76-afb2-4185-ab7d-4d62c0654881',
    '76b50f76-afb2-4185-ab7d-4d62c0654885'
  ],

  transactions: {
    '6e1c322c-aea6-4484-8fdc-7b3227a9d359': {
      stage: 'pending',
      label: 'Example',
      date: 1547768373,
      value: 0,
      from: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      to: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      fiatValue: {
        USD: '0'
      }
    },
    '76b50f76-afb2-4185-ab7d-4d62c0654881': {
      stage: 'completed',
      label: 'Example',
      date: 1547769373,
      value: 0,
      from: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      to: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      fiatValue: {
        USD: '0'
      }
    },
    '76b50f76-afb2-4185-ab7d-4d62c0654885': {
      stage: 'completed',
      label: 'Example',
      date: 1548769373,
      value: 0,
      from: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      to: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      fiatValue: {
        USD: '0'
      }
    }
  },
  allTransactions: [
    '6e1c322c-aea6-4484-8fdc-7b3227a9d359',
    '76b50f76-afb2-4185-ab7d-4d62c0654885',
    '76b50f76-afb2-4185-ab7d-4d62c0654881'
  ],

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
  allAccountTypes: ['MetaMask'],

  assets: {
    '12d3cbf2-de3a-4050-a0c6-521592e4b85a': {
      option: 'Ethereum',
      amount: '14.13',
      network: 'ETH',
      type: 'base',
      symbol: 'ETH'
    },
    '10e14757-78bb-4bb2-a17a-8333830f6698': {
      option: 'OmiseGo',
      amount: '2',
      network: 'ETH',
      type: 'call',
      symbol: 'OMG',
      contractAddress: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
      decimal: 18
    }
  },
  allAssets: ['12d3cbf2-de3a-4050-a0c6-521592e4b85a', '10e14757-78bb-4bb2-a17a-8333830f6698'],

  localSettings: {
    '17ed6f49-ff23-4bef-a676-69174c266b37': {
      fiatCurrency: 'GBP',
      favorite: false
    }
  },
  allLocalSettings: ['17ed6f49-ff23-4bef-a676-69174c266b37'],

  networkOptions: {
    ETH: {
      id: 'ETH',
      name: 'Ethereum',
      unit: 'ETH',
      chainId: 1,
      isCustom: false,
      color: '#007896',
      blockExplorer: {},
      tokenExplorer: {},
      tokens: [],
      contracts: ['17ed6f49-ff23-4bef-a676-69174c266b38'],
      nodes: ['eth_mycrypto'],
      dPathFormats: {},
      gasPriceSettings: {
        min: 1,
        max: 100,
        initial: 15
      },
      shouldEstimateGasPrice: true
    }
  },
  allNetworkOptions: ['ETH'],

  nodeOptions: {
    eth_mycrypto: {
      name: 'eth_mycrypto',
      type: 'rpc',
      service: 'MyCrypto',
      url: 'https://api.mycryptoapi.com/eth'
    }
  },
  allNodeOptions: ['eth_mycrypto'],

  assetOptions: {
    Ethereum: {
      name: 'Ethereum',
      network: 'Ethereum',
      ticker: 'ETH',
      type: 'coin',
      decimal: 18,
      contractAddress: null
    }
  },
  allAssetOptions: ['Ethereum'],

  contractOptions: {
    '17ed6f49-ff23-4bef-a676-69174c266b38': {
      name: 'Athenian: Warrior for Battle',
      network: 'Ethereum',
      address: '0x17052d51E954592C1046320c2371AbaB6C73Ef10',
      abi:
        '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"},{"name":"tokenSupply","type":"uint256"}],"name":"SetupToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"adr","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]'
    }
  },
  allContractOptions: ['17ed6f49-ff23-4bef-a676-69174c266b38'],

  derivationPathOptions: {},
  allDerivationPathOptions: [],

  addressMetadata: {
    '0x80200997f095da94e404f7e0d581aab1ffba9f7d': {
      address: '0x80200997f095da94e404f7e0d581aab1ffba9f7d',
      label: 'My Wallet',
      notes: 'This is my wallet.'
    }
  },
  allAddressMetadata: ['0x80200997f095da94e404f7e0d581aab1ffba9f7d'],

  activeNotifications: {
    '61d84f5e-0efa-46b9-915c-aed6ebe5a4dd': {
      template: 'wallet-created'
    }
  },
  allActiveNotifications: ['61d84f5e-0efa-46b9-915c-aed6ebe5a4dd'],

  fiatCurrencies: {
    USD: {
      code: 'USD',
      name: 'US Dollars'
    }
  },
  allFiatCurrencies: ['USD']
};

export const CACHE_INIT: LocalCache = {
  // : LocalCache
  currents: {},

  recentAccounts: [],

  globalSettings: {},

  accounts: {},
  allAccounts: [],

  transactionHistories: {},
  allTransactionHistories: [],

  transactions: {},
  allTransactions: [],

  accountTypes: {},
  allAccountTypes: [],

  assets: {},
  allAssets: [],

  localSettings: {},
  allLocalSettings: [],

  networkOptions: {},
  allNetworkOptions: [],

  nodeOptions: {},
  allNodeOptions: [],

  assetOptions: {},
  allAssetOptions: [],

  contractOptions: {},
  allContractOptions: [],

  derivationPathOptions: {},
  allDerivationPathOptions: [],

  addressMetadata: {},
  allAddressMetadata: [],

  activeNotifications: {},
  allActiveNotifications: [],

  fiatCurrencies: {},
  allFiatCurrencies: []
};
