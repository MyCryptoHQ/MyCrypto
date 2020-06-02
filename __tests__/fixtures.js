const FIXTURES_CONST = {
  TIMEOUT: 5000,
  BASE_URL: 'https://localhost:3000'
};

const PAGES = {
  DASHBOARD: `${FIXTURES_CONST.BASE_URL}/dashboard`,
  NO_ACCOUNTS: `${FIXTURES_CONST.BASE_URL}/no-accounts`,
  SETTINGS: `${FIXTURES_CONST.BASE_URL}/settings`,
  ADD_ACCOUNT_MNEMONIC: `${FIXTURES_CONST.BASE_URL}/add-account/mnemonic_phrase`,
};

const NETWORK_NAME_FIXTURE = 'Ropsten';

const ENV = {
  E2E_MNEMONIC_PASSPHRASE: process.env.E2E_MNEMONIC_PASSPHRASE
};

const ENV_KEYS = Object.keys(ENV);
if (ENV_KEYS.some(k => !ENV[k])) {
  const envKeysUnset = ENV_KEYS.filter(k => !ENV[k]);
  throw Error(`Required ENV variables to be set: '${envKeysUnset.join('\',\'')}'`);
}

export {
  FIXTURES_CONST,
  PAGES,
  NETWORK_NAME_FIXTURE,
  ENV
}
