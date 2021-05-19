require('dotenv').config();

const ENV = {
  // Defined in github/workflow to run against mycryptobuilds
  E2E_BASE_URL: process.env.E2E_BASE_URL
};

const ENV_KEYS = Object.keys(ENV);
if (ENV_KEYS.some((k) => !ENV[k])) {
  const envKeysUnset = ENV_KEYS.filter((k) => !ENV[k]);
  throw Error(`Required ENV variables to be set: '${envKeysUnset.join("','")}'`);
}

const FIXTURES_CONST = {
  TIMEOUT: 5000,
  HARDHAT_TIMEOUT: 60000,
  BASE_URL: ENV.E2E_BASE_URL
};

const PAGES = {
  DASHBOARD: `${FIXTURES_CONST.BASE_URL}/dashboard`,
  SETTINGS: `${FIXTURES_CONST.BASE_URL}/settings`,
  SETTINGS_EXPORT: `${FIXTURES_CONST.BASE_URL}/settings/export`,
  SETTINGS_IMPORT: `${FIXTURES_CONST.BASE_URL}/settings/import`,
  ADD_ACCOUNT_MNEMONIC: `${FIXTURES_CONST.BASE_URL}/add-account/mnemonic_phrase`,
  ADD_ACCOUNT_VIEWONLY: `${FIXTURES_CONST.BASE_URL}/add-account/view_only`,
  ADD_ACCOUNT_PRIVATE_KEY: `${FIXTURES_CONST.BASE_URL}/add-account/private_key`,
  ADD_ACCOUNT_KEYSTORE: `${FIXTURES_CONST.BASE_URL}/add-account/keystore_file`,
  ADD_ACCOUNT_WEB3: `${FIXTURES_CONST.BASE_URL}/add-account/web3`,
  SEND: `${FIXTURES_CONST.BASE_URL}/send`,
  ADD_ACCOUNT: `${FIXTURES_CONST.BASE_URL}/add-account`,
  TX_STATUS: `${FIXTURES_CONST.BASE_URL}/tx-status`,
  SWAP: `${FIXTURES_CONST.BASE_URL}/swap`
};

const FIXTURE_ETHEREUM = 'Ethereum';

// MyCrypto Dev Testing Account with multiple tokens - should probably be swapped out for a dedicated E2E testing account
const FIXTURE_VIEW_ONLY_ADDRESS = '0x82D69476357A03415E92B5780C89e5E9e972Ce75';

const FIXTURE_INCOMING_TX_HASH =
  '0x3513f1483cd87ffca1d2c2f9d5a6c49376c2c87d8e27b98e7ae973642cd8a10b';

const FIXTURE_VIEW_ONLY_TOKENS = ['ANT', 'BAT', 'DAI'];

const FIXTURE_SEND_CONTACT = 'Web3 Account 1';

const FIXTURE_SEND_ADDRESS = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520';

const FIXTURE_SEND_AMOUNT = '0.001';

const FIXTURE_WEB3_ADDRESS = '0xc6d5a3c98ec9073b54fa0969957bd582e8d874bf';

const FIXTURE_MYC_STORAGE_KEY = 'MYC_Storage';

const FIXTURE_HARDHAT_PRIVATE_KEY =
  '0xeaf2c50dfd10524651e7e459c1286f0c2404eb0f34ffd2a1eb14373db49fceb6';

const FIXTURE_LOCALSTORAGE_WITH_ONE_ACC = {
  version: 'v2.0.0',
  accounts: {
    '1782c060-8bc0-55d6-8078-ff255b4aae90': {
      address: '0x32F08711dC8ca3EB239e01f427AE3713DB1f6Be3',
      networkId: 'Goerli',
      wallet: 'WEB3',
      dPath: "m/44'/60'/0'/0/0",
      assets: [
        {
          ticker: 'GoerliETH',
          name: 'GoerliETH',
          decimal: 18,
          networkId: 'Goerli',
          type: 'base',
          isCustom: false,
          uuid: 'ac3478d6-9a3c-51fa-a2e6-0f5c3696165a',
          balance: '10119688100000000000',
          mtime: 1614873218615
        }
      ],
      transactions: [],
      favorite: false,
      mtime: 0,
      uuid: '1782c060-8bc0-55d6-8078-ff255b4aae90',
      label: 'Web3 Account 1'
    }
  },
  addressBook: {
    'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe': {
      label: 'MyCrypto Team Tip Jar',
      address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      notes: "This is MyCrypto's Donate address. Feel free to delete it!",
      network: 'Ethereum',
      uuid: 'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe'
    },
    'b6260cfc-c6ff-b385-af20-1cc95e308b33': {
      label: 'Web3 Account 1',
      address: '0x32F08711dC8ca3EB239e01f427AE3713DB1f6Be3',
      notes: '',
      network: 'Goerli',
      uuid: 'b6260cfc-c6ff-b385-af20-1cc95e308b33'
    }
  },
  assets: {},
  rates: {},
  trackedAssets: {},
  contracts: {},
  networks: {},
  notifications: {
    '1c44bb44-02d4-0db1-b7dd-f3d001ef877b': {
      uuid: '1c44bb44-02d4-0db1-b7dd-f3d001ef877b',
      template: 'wallet-added',
      templateData: { address: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88' },
      dateDisplayed: '2020-06-04T09:58:09.485Z',
      dismissed: false
    },
    '4cce94f3-f9b7-ff5f-2ad4-74d881376e7c': {
      uuid: '4cce94f3-f9b7-ff5f-2ad4-74d881376e7c',
      template: 'onboarding-responsible',
      templateData: { firstDashboardVisitDate: '2020-06-04T09:58:09.575Z' },
      dateDisplayed: '2020-06-04T09:58:09.575Z',
      dismissed: false
    }
  },
  settings: {
    canTrackProductAnalytics: true,
    fiatCurrency: 'USD',
    darkMode: false,
    dashboardAccounts: ['1782c060-8bc0-55d6-8078-ff255b4aae90'],
    excludedAssets: [],
    language: 'en',
    isDemoMode: false
  },
  networkNodes: {},
  userActions: {},
  mtime: 1607526708529
};

const FIXTURE_HARDHAT = {
  version: 'v2.0.0',
  accounts: {
    '4a236c90-b722-5e26-8718-659db6b5d302': {
      address: '0xc6d5a3c98ec9073b54fa0969957bd582e8d874bf',
      networkId: 'Ethereum',
      wallet: 'WEB3',
      dPath: "m/44'/60'/0'/0/0",
      assets: [
        {
          ticker: 'ETH',
          name: 'Ether (Ethereum)',
          decimal: 18,
          support: {},
          social: {},
          networkId: 'Ethereum',
          type: 'base',
          mappings: {
            coinCapId: 'ethereum',
            coinGeckoId: 'ethereum',
            cryptoCompareId: 'ETH',
            cryptoCurrencyIconName: 'eth',
            dexAgId: 'ETH'
          },
          isCustom: false,
          uuid: '356a192b-7913-504c-9457-4d18c28d46e6',
          balance: '9998866308480000000000',
          mtime: 1621347441875
        },
        {
          ticker: 'DAI',
          name: 'DAI Stablecoin',
          decimal: 18,
          support: {},
          social: {},
          networkId: 'Ethereum',
          type: 'erc20',
          isCustom: false,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          uuid: 'e1f698bf-cb85-5405-b563-14774af14bf1',
          balance: '9998866308480000000000',
          mtime: 1621347441875
        }
      ],
      transactions: [],
      favorite: false,
      mtime: 0,
      uuid: '4a236c90-b722-5e26-8718-659db6b5d302',
      label: 'Web3 Account 1'
    }
  },
  addressBook: {
    'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe': {
      label: 'MyCrypto Team Tip Jar',
      address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      notes: "This is MyCrypto's Donate address. Feel free to delete it!",
      network: 'Ethereum',
      uuid: 'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe'
    },
    'b6260cfc-c6ff-b385-af20-1cc95e308b33': {
      label: 'Web3 Account 1',
      address: '0xc6d5a3c98ec9073b54fa0969957bd582e8d874bf',
      notes: '',
      network: 'Ethereum',
      uuid: '4a236c90-b722-5e26-8718-659db6b5d302'
    }
  },
  assets: {},
  rates: {},
  trackedAssets: {},
  contracts: {},
  networks: {
    Ethereum: {
      id: 'Ethereum',
      selectedNode: 'ethereum_Hardhat',
      nodes: [
        {
          url: 'http://127.0.0.1:8546/',
          service: 'Hardhat',
          name: 'ethereum_Hardhat',
          isCustom: true,
          type: 'myccustom'
        }
      ]
    }
  },
  notifications: {
    '1c44bb44-02d4-0db1-b7dd-f3d001ef877b': {
      uuid: '1c44bb44-02d4-0db1-b7dd-f3d001ef877b',
      template: 'wallet-added',
      templateData: { address: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88' },
      dateDisplayed: '2020-06-04T09:58:09.485Z',
      dismissed: false
    },
    '4cce94f3-f9b7-ff5f-2ad4-74d881376e7c': {
      uuid: '4cce94f3-f9b7-ff5f-2ad4-74d881376e7c',
      template: 'onboarding-responsible',
      templateData: { firstDashboardVisitDate: '2020-06-04T09:58:09.575Z' },
      dateDisplayed: '2020-06-04T09:58:09.575Z',
      dismissed: false
    }
  },
  settings: {
    canTrackProductAnalytics: true,
    fiatCurrency: 'USD',
    darkMode: false,
    dashboardAccounts: ['1782c060-8bc0-55d6-8078-ff255b4aae90'],
    excludedAssets: [],
    language: 'en',
    isDemoMode: false
  },
  userActions: {}
};

export {
  ENV,
  FIXTURES_CONST,
  PAGES,
  FIXTURE_SEND_CONTACT,
  FIXTURE_SEND_ADDRESS,
  FIXTURE_SEND_AMOUNT,
  FIXTURE_LOCALSTORAGE_WITH_ONE_ACC,
  FIXTURE_MYC_STORAGE_KEY,
  FIXTURE_ETHEREUM,
  FIXTURE_VIEW_ONLY_ADDRESS,
  FIXTURE_VIEW_ONLY_TOKENS,
  FIXTURE_INCOMING_TX_HASH,
  FIXTURE_WEB3_ADDRESS,
  FIXTURE_HARDHAT_PRIVATE_KEY,
  FIXTURE_HARDHAT
};
