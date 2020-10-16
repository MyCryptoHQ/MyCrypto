const ENV = {
  // Should be set in order to use Mnemonic in AddAccount flow
  E2E_PRIVATE_KEY: process.env.E2E_PRIVATE_KEY,

  // Defined in github/workflow to run against mycryptobuilds
  E2E_BASE_URL: process.env.E2E_BASE_URL || 'https://localhost:3000'
};

const ENV_KEYS = Object.keys(ENV);
if (ENV_KEYS.some((k) => !ENV[k])) {
  const envKeysUnset = ENV_KEYS.filter((k) => !ENV[k]);
  throw Error(`Required ENV variables to be set: '${envKeysUnset.join("','")}'`);
}

const FIXTURES_CONST = {
  TIMEOUT: 5000,
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
  TX_STATUS: `${FIXTURES_CONST.BASE_URL}/tx-status`
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

const FIXTURE_WEB3_ADDRESS = '0x32F08711dC8ca3EB239e01f427AE3713DB1f6Be3 ';

const FIXTURE_MYC_STORAGE_KEY = 'MYC_Storage';

const FIXTURE_LOCALSTORAGE_WITH_ONE_ACC = {
  version: 'v1.0.0',
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
          balance: { _hex: '0x3e73362871420000' },
          mtime: 1581530607024
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
      label: 'MyCrypto Tip Jar',
      address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      notes: 'Toss us a coin!',
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
    fiatCurrency: 'USD',
    darkMode: false,
    dashboardAccounts: ['256b782e-52bc-51f9-a357-602501e59700'],
    excludedAssets: [],
    inactivityTimer: 1800000,
    rates: {},
    language: 'en',
    isDemoMode: false
  },
  password: '',
  networkNodes: {},
  userActions: {},
  mtime: 1607526708529
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
  FIXTURE_WEB3_ADDRESS
};
