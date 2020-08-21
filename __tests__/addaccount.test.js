import { getByText } from '@testing-library/testcafe';
import { t, Selector } from 'testcafe';
import {
  PAGES,
  FIXTURE_MYC_STORAGE_KEY,
  FIXTURE_VIEW_ONLY_ADDRESS,
  FIXTURE_PRIVATE_KEY_ADDRESS,
  FIXTURE_VIEW_ONLY_TOKENS,
  FIXTURE_PRIVATE_KEY_TOKENS,
  FIXTURES_CONST
} from './fixtures';
import { findByTKey } from './translation-utils';
import { clearLocalStorage } from './localstorage-utils';
import AddAccountPage from './addaccount-page.po';
import DashboardPage from './dashboard-page.po';

const addAccountPage = new AddAccountPage();
const dashboardPage = new DashboardPage();

fixture('Add Accounts').page(PAGES.DASHBOARD);

test('Should show wallet add UI', async (t) => {
  await addAccountPage.navigateToPage();
  await addAccountPage.waitPageLoaded();

  const title = getByText(findByTKey('DECRYPT_ACCESS'));
  await t.expect(title).ok();
});

// Add Account - View Only
test('Should be able to add a view only address', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await addAccountPage.addViewOnly();
  await dashboardPage.waitPageLoaded();

  await dashboardPage.expectAddressToBePresent(FIXTURE_VIEW_ONLY_ADDRESS);
  await dashboardPage.expectAccountTableToMatchCount(1);

  FIXTURE_VIEW_ONLY_TOKENS.forEach((t) => dashboardPage.expectBalanceInBalanceList(t));
});

// Add Account - Private Key
test('Should be able to add a private key address', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await addAccountPage.selectPrivateKeyWalletType();

  await addAccountPage.waitForPage(PAGES.ADD_ACCOUNT_PRIVATE_KEY);

  await addAccountPage.selectEthereumNetwork();
  await addAccountPage.inputPrivateKey();
  // wait for cryptography to finish
  await t
    .expect(Selector('button').withText(findByTKey('ADD_LABEL_6_SHORT')).hasAttribute('disabled'))
    .notOk('ready for testing', { timeout: FIXTURES_CONST.TIMEOUT });
  await addAccountPage.submitAddAccountPrivateKey();

  await dashboardPage.waitPageLoaded();

  await dashboardPage.expectAddressToBePresent(FIXTURE_PRIVATE_KEY_ADDRESS);
  await dashboardPage.expectAccountTableToMatchCount(1);

  FIXTURE_PRIVATE_KEY_TOKENS.forEach((t) => dashboardPage.expectBalanceInBalanceList(t));
});

// Add Account - Keystore File
test('Should be able to add a keystore file address', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await addAccountPage.selectKeystoreFileWalletType();

  await addAccountPage.waitForPage(PAGES.ADD_ACCOUNT_KEYSTORE);

  await addAccountPage.selectEthereumNetwork();
  await addAccountPage.inputKeystoreFileAndPassword();
  await t
    .expect(Selector('button').withText(findByTKey('ADD_LABEL_6_SHORT')).hasAttribute('disabled'))
    .notOk('ready for testing', { timeout: FIXTURES_CONST.TIMEOUT });
  await addAccountPage.submitAddAccountKeystoreFile();

  await dashboardPage.waitPageLoaded(FIXTURES_CONST.TIMEOUT * 2);

  await dashboardPage.expectAddressToBePresent(FIXTURE_PRIVATE_KEY_ADDRESS);
  await dashboardPage.expectAccountTableToMatchCount(1);

  FIXTURE_PRIVATE_KEY_TOKENS.forEach((t) => dashboardPage.expectBalanceInBalanceList(t));
});
