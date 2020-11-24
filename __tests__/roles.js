import { getByText } from '@testing-library/testcafe';
import { ClientFunction, Role, t } from 'testcafe';

import { setupEthereumMock } from './ethereum-mock';
import { ENV, FIXTURE_LOCALSTORAGE_WITH_ONE_ACC, FIXTURE_MYC_STORAGE_KEY, PAGES } from './fixtures';
import { waitForProperty } from './helpers';
import { setLocalStorage } from './localstorage-utils';
import { getTransValueByKey } from './translation-utils';

const getCurrentLocation = ClientFunction(() => window.location.href);

export const web3Account = Role(
  PAGES.ADD_ACCOUNT_WEB3,
  async (t) => {
    await setupEthereumMock(ENV.E2E_PRIVATE_KEY, 5);
    await t
      .click(getByText(getTransValueByKey('ADD_WEB3_DEFAULT')))
      .expect(getCurrentLocation())
      .eql(PAGES.DASHBOARD);
  },
  { preserveUrl: true }
);

const setupPersistance = async () => {
  await setLocalStorage(FIXTURE_MYC_STORAGE_KEY, FIXTURE_LOCALSTORAGE_WITH_ONE_ACC);
  await t.wait(5000);
  await t.expect(waitForProperty((w) => w.rehydrate)).ok();
  await ClientFunction(() => {
    window.rehydrate();
  })();
};

export const withLS = Role(
  PAGES.ADD_ACCOUNT,
  async (t) => {
    await setupPersistance();
    await t.wait(5000);
    await t.navigateTo(PAGES.DASHBOARD).expect(getCurrentLocation()).eql(PAGES.DASHBOARD);
  },
  { preserveUrl: true }
);
