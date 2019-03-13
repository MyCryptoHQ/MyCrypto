import { Account } from '../Account';
import { AssetOption } from '../AssetOption';
import { LocalSetting } from '../LocalSettings';
import { Transaction } from '../Transaction';
import { FiatCurrency } from '../FiatCurrency';

export const CACHE_KEY = 'MyCryptoCache';

export interface LocalCache {
  currents: Partial<{
    account?: string[];
    fiatCurrency?: string;
    activeWallet?: string;
  }>;

  globalSettings: Partial<{
    fiatCurrency?: string;
    darkMode?: boolean;
  }>;

  recentAccounts: string[];

  accounts: Record<string, Account>;
  allAccounts: string[];

  transactionHistories: Record<
    string,
    {
      transaction: string;
    }
  >;
  allTransactionHistories: string[];

  transactions: Record<string, Transaction>;
  allTransactions: string[];

  accountTypes: Record<
    string,
    {
      name: string;
      key: string;
      secure: boolean;
      derivationPath: string;
    }
  >;
  allAccountTypes: string[];

  assets: Record<
    string,
    {
      option: string;
      amount: string;
    }
  >;
  allAssets: string[];

  localSettings: Record<string, LocalSetting>;
  allLocalSettings: string[];

  networkOptions: Record<
    string,
    {
      name: string;
      blockExplorer: string;
      tokenExplorer: string;
      chainId: number;
      contracts: string[];
      derivationPaths: string[];
      assets: string[];
      nodes: string[];
    }
  >;
  allNetworkOptions: string[];

  nodeOptions: Record<
    string,
    {
      name: string;
    }
  >;
  allNodeOptions: string[];

  assetOptions: Record<string, AssetOption>;
  allAssetOptions: string[];

  contractOptions: Record<
    string,
    {
      name: string;
      network: string;
      address: string;
      abi: string;
    }
  >;
  allContractOptions: string[];

  derivationPathOptions: Record<
    string,
    {
      name: string;
      derivationPath: string;
      active: boolean;
    }
  >;
  allDerivationPathOptions: string[];

  addressMetadata: Record<
    string,
    {
      address: string;
      label: string;
      notes: string;
    }
  >;
  allAddressMetadata: string[];

  activeNotifications: Record<
    string,
    {
      template: string;
    }
  >;
  allActiveNotifications: string[];

  fiatCurrencies: Record<string, FiatCurrency>;
  allFiatCurrencies: string[];
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
    '76b50f76-afb2-4185-ab7d-4d62c0654882': {
      transaction: '76b50f76-afb2-4185-ab7d-4d62c0654882'
    }
  },
  allTransactionHistories: ['76b50f76-afb2-4185-ab7d-4d62c0654882'],

  transactions: {
    '76b50f76-afb2-4185-ab7d-4d62c0654883': {
      stage: 'pending',
      label: 'Example',
      date: '1547768373',
      from: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      to: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      fiatValue: {
        USD: '13.37'
      }
    }
  },
  allTransactions: ['76b50f76-afb2-4185-ab7d-4d62c0654883'],

  accountTypes: {
    MetaMask: {
      name: 'MetaMask',
      key: 'metamask',
      secure: true,
      derivationPath: ''
    }
  },
  allAccountTypes: ['MetaMask'],

  assets: {
    '12d3cbf2-de3a-4050-a0c6-521592e4b85a': {
      option: 'Ethereum',
      amount: '14.13'
    }
  },
  allAssets: ['12d3cbf2-de3a-4050-a0c6-521592e4b85a'],

  localSettings: {
    '17ed6f49-ff23-4bef-a676-69174c266b37': {
      fiatCurrency: 'GBP',
      favorite: false
    }
  },
  allLocalSettings: ['17ed6f49-ff23-4bef-a676-69174c266b37'],

  networkOptions: {
    Ethereum: {
      name: 'Ethereum',
      blockExplorer: 'etherscan',
      tokenExplorer: '',
      chainId: 1,
      contracts: ['17ed6f49-ff23-4bef-a676-69174c266b38'],
      derivationPaths: ['17ed6f49-ff23-4bef-a676-69174c266b39'],
      assets: ['17ed6f49-ff23-4bef-a676-69174c266b30'],
      nodes: ['Ethereum (Auto)']
    }
  },
  allNetworkOptions: ['Ethereum'],

  nodeOptions: {
    'Ethereum (Auto)': {
      name: 'Ethereum (Auto)'
    }
  },
  allNodeOptions: ['Ethereum (Auto)'],

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
    '6e1c322c-aea6-4484-8fdc-7b3227a9d359': {
      address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      label: 'My Wallet',
      notes: 'This is my wallet.'
    }
  },
  allAddressMetadata: ['6e1c322c-aea6-4484-8fdc-7b3227a9d359'],

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
