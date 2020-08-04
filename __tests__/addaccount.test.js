import { getByText } from '@testing-library/testcafe';
import {
  PAGES,
  FIXTURE_MYC_STORAGE_KEY,
  FIXTURE_VIEW_ONLY_ADDRESS,
  FIXTURE_PRIVATE_KEY_ADDRESS,
  FIXTURE_VIEW_ONLY_TOKENS,
  FIXTURE_PRIVATE_KEY_TOKENS,
  FIXTURES_CONST
} from './fixtures';
import { getTransValueByKey } from './translation-utils';
import { clearLocalStorage } from './localstorage-utils';
import AddAccountPage from './addaccount-page.po';
import DashboardPage from './dashboard-page.po';

const addAccountPage = new AddAccountPage();
const dashboardPage = new DashboardPage();

fixture('Add Accounts').page(PAGES.DASHBOARD);

test('Should show wallet add UI', async (t) => {
  await addAccountPage.navigateToPage();
  await addAccountPage.waitPageLoaded();

  const title = getByText(getTransValueByKey('DECRYPT_ACCESS'));
  await t.expect(title).ok();
});

// Add Account - View Only
test('Should be able to add a view only address', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await addAccountPage.addViewOnly();
  await dashboardPage.waitPageLoaded();

  await dashboardPage.expectAddressToBePresent(FIXTURE_VIEW_ONLY_ADDRESS);
  await dashboardPage.expectAccountTableToMatchCount(1);
});

test('When a view only address is added should be displayed in dashboard metrics', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await addAccountPage.addViewOnly();

  await dashboardPage.waitPageLoaded();

  FIXTURE_VIEW_ONLY_TOKENS.forEach((t) => dashboardPage.expectBalanceInBalanceList(t));
});

// Add Account - Private Key
test('Should be able to add a private key address', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await addAccountPage.addPrivateKey();

  await dashboardPage.waitPageLoaded();

  await dashboardPage.expectAddressToBePresent(FIXTURE_PRIVATE_KEY_ADDRESS);
  await dashboardPage.expectAccountTableToMatchCount(1);
});

test('When a private key address is added should be displayed in dashboard metrics', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await addAccountPage.addPrivateKey();

  await dashboardPage.waitPageLoaded();

  FIXTURE_PRIVATE_KEY_TOKENS.forEach((t) => dashboardPage.expectBalanceInBalanceList(t));
});

// Add Account - Keystore File
test('Should be able to add a keystore file address', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await addAccountPage.addKeystoreFile();

  await dashboardPage.waitPageLoaded(FIXTURES_CONST.TIMEOUT * 2);

  await dashboardPage.expectAddressToBePresent(FIXTURE_PRIVATE_KEY_ADDRESS);
  await dashboardPage.expectAccountTableToMatchCount(1);
});

test('When a keystore file address is added should be displayed in dashboard metrics', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await addAccountPage.addKeystoreFile();

  await dashboardPage.waitPageLoaded(FIXTURES_CONST.TIMEOUT * 2);

  FIXTURE_PRIVATE_KEY_TOKENS.forEach((t) => dashboardPage.expectBalanceInBalanceList(t));
});