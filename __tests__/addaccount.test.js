import { getByText } from '@testing-library/testcafe';
import {
  PAGES,
  FIXTURE_MYC_STORAGE_KEY,
  FIXTURE_VIEW_ONLY_ADDRESS,
  FIXTURE_VIEW_ONLY_TOKENS
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

  dashboardPage.waitPageLoaded();

  FIXTURE_VIEW_ONLY_TOKENS.forEach((t) => dashboardPage.expectBalanceInBalanceList(t));
});
