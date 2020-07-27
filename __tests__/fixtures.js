const ENV = {
  // Should be set in order to use Mnemonic in AddAccount flow
  // @todo: activate ENV var when we decide about testing Mnemonic
  // E2E_MNEMONIC_PASSPHRASE: process.env.E2E_MNEMONIC_PASSPHRASE,

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
  NO_ACCOUNTS: `${FIXTURES_CONST.BASE_URL}/no-accounts`,
  SETTINGS: `${FIXTURES_CONST.BASE_URL}/settings`,
  ADD_ACCOUNT_MNEMONIC: `${FIXTURES_CONST.BASE_URL}/add-account/mnemonic_phrase`,
  ADD_ACCOUNT_VIEWONLY: `${FIXTURES_CONST.BASE_URL}/add-account/view_only`,
  SEND: `${FIXTURES_CONST.BASE_URL}/send`,
  ADD_ACCOUNT: `${FIXTURES_CONST.BASE_URL}/add-account`
};

const NETWORK_NAME_FIXTURE = 'Ropsten';

const FIXTURE_ETHEREUM = 'Ethereum';

// MyCrypto Dev Testing Account with multiple tokens - should probably be swapped out for a dedicated E2E testing account
const FIXTURE_VIEW_ONLY_ADDRESS = '0x82D69476357A03415E92B5780C89e5E9e972Ce75';

const FIXTURE_VIEW_ONLY_TOKENS = ['ANT', 'BAT', 'DAI'];

const FIXTURE_SEND_CONTACT = 'MyCrypto Tip Jar';

const FIXTURE_SEND_ADDRESS = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520';

const FIXTURE_SEND_AMOUNT = '0.001';

const FIXTURE_MYC_STORAGE_KEY = 'MYC_Storage';

const FIXTURE_LOCALSTORAGE_EMPTY = {
  version: 'v1.0.0',
  accounts: {},
  addressBook: {
    'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe': {
      label: 'MyCrypto Tip Jar',
      address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      notes: 'Toss us a coin!',
      network: 'Ethereum',
      uuid: 'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe'
    }
  },
  assets: {},
  contracts: {},
  networks: {},
  notifications: {},
  settings: {
    fiatCurrency: 'USD',
    darkMode: false,
    dashboardAccounts: [],
    inactivityTimer: 1800000,
    rates: {},
    language: 'en'
  },
  password: '',
  networkNodes: { Ethereum: { selectedNode: 'web3' }, Ropsten: { selectedNode: 'web3' } },
  mtime: 1591264444786
};

const FIXTURE_LOCALSTORAGE_WITH_ONE_ACC = {
  version: 'v1.0.0',
  accounts: {
    '256b782e-52bc-51f9-a357-602501e59700': {
      address: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88',
      networkId: 'Ropsten',
      wallet: 'MNEMONIC_PHRASE',
      dPath: "m/44'/1'/0'/0/0",
      assets: [
        {
          ticker: 'RopstenETH',
          name: 'Ropsten',
          decimal: 18,
          networkId: 'Ropsten',
          type: 'base',
          mappings: {},
          isCustom: false,
          uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7',
          balance: { _hex: '0x06c11b86ae814800' },
          mtime: 1591264690383
        }
      ],
      transactions: [],
      favorite: false,
      mtime: 0,
      uuid: '256b782e-52bc-51f9-a357-602501e59700',
      label: 'Mnemonic Phrase Account 1'
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
    '8c7beeff-74ce-427b-e7e1-64f7ed21b98d': {
      label: 'Mnemonic Phrase Account 1',
      address: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88',
      notes: '',
      network: 'Ropsten',
      uuid: '8c7beeff-74ce-427b-e7e1-64f7ed21b98d'
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
    inactivityTimer: 1800000,
    rates: {},
    language: 'en'
  },
  password: '',
  networkNodes: { Ethereum: { selectedNode: 'web3' }, Ropsten: { selectedNode: 'web3' } },
  mtime: 1591264705862
};

export {
  ENV,
  FIXTURES_CONST,
  PAGES,
  NETWORK_NAME_FIXTURE,
  FIXTURE_SEND_CONTACT,
  FIXTURE_SEND_ADDRESS,
  FIXTURE_SEND_AMOUNT,
  FIXTURE_LOCALSTORAGE_EMPTY,
  FIXTURE_LOCALSTORAGE_WITH_ONE_ACC,
  FIXTURE_MYC_STORAGE_KEY,
  FIXTURE_ETHEREUM,
  FIXTURE_VIEW_ONLY_ADDRESS,
  FIXTURE_VIEW_ONLY_TOKENS
};
