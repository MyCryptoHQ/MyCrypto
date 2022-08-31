import { getByText } from '@testing-library/testcafe';

import AddAccountPage from './addaccount-page.po';
import DashboardPage from './dashboard-page.po';
import {
  FIXTURE_VIEW_ONLY_ADDRESS,
  FIXTURE_VIEW_ONLY_TOKENS,
  FIXTURE_WEB3_ADDRESS,
  PAGES
} from './fixtures';
import { findByTKey } from './translation-utils';

const addAccountPage = new AddAccountPage();
const dashboardPage = new DashboardPage();

fixture('Add Accounts').page(PAGES.ADD_ACCOUNT);

test('Should show wallet add UI', async (t) => {
  await addAccountPage.navigateToPage();
  await addAccountPage.waitPageLoaded();

  const title = getByText(findByTKey('DECRYPT_ACCESS'));
  await t.expect(title.exists).ok();
});

// Add Account - View Only
test('Should be able to add a view only address', async () => {
  await addAccountPage.addViewOnly();
  await dashboardPage.waitPageLoaded();

  await dashboardPage.expectAddressToBePresent(FIXTURE_VIEW_ONLY_ADDRESS);
  await dashboardPage.expectAccountTableToMatchCount(1);

  FIXTURE_VIEW_ONLY_TOKENS.forEach((t) => dashboardPage.expectBalanceInBalanceList(t));
});

// Add Account - Web3
test('Should be able to add a web3 address', async () => {
  await addAccountPage.addWeb3();
  await dashboardPage.waitPageLoaded();

  await dashboardPage.expectAddressToBePresent(FIXTURE_WEB3_ADDRESS);
  await dashboardPage.expectAccountTableToMatchCount(1);
});
