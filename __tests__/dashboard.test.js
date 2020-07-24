import { getByText } from '@testing-library/testcafe';

import { PAGES, FIXTURE_MYC_STORAGE_KEY, FIXTURE_VIEW_ONLY_TOKENS } from './fixtures';
import { getTransValueByKey } from './translation-utils';
import { clearLocalStorage } from './localstorage-utils';

import NoAccountsPage from './no-accounts-page.po';
import SettingsPage from './settings-page.po';
import AddAccountPage from './addaccount-page.po';
import DashboardPage from './dashboard-page.po';

const noAccountsPage = new NoAccountsPage();
const settingsPage = new SettingsPage();
const addAccountPage = new AddAccountPage();
const dashboardPage = new DashboardPage();

fixture('Dashboard').page(PAGES.DASHBOARD);

test('Should redirect to no-accounts', async (t) => {
  await noAccountsPage.waitPageLoaded();

  const title = getByText(getTransValueByKey('NO_ACCOUNTS_HEADER'));
  await t.expect(title).ok();
});

test('Should show view only account in dashboard metrics', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await addAccountPage.addViewOnly();

  dashboardPage.waitPageLoaded();

  FIXTURE_VIEW_ONLY_TOKENS.forEach((t) => dashboardPage.expectBalanceInBalanceList(t));
  FIXTURE_VIEW_ONLY_TOKENS.forEach((t) => dashboardPage.expectTokenInTokenList(t));
});

// @todo Deactivated until we figure if we want to use e2e to test Mnemonic functionnality
// test('Should add account', async () => {
//   await settingsPage.addAccount();
//   await settingsPage.waitForPage(PAGES.DASHBOARD);
// });
