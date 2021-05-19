import { getByText } from '@testing-library/testcafe';

import AddAccountPage from './addaccount-page.po';
import { injectLS } from './clientScripts';
import DashboardPage from './dashboard-page.po';
import { FIXTURE_LOCALSTORAGE_WITH_ONE_ACC, PAGES } from './fixtures';
import { getTransValueByKey } from './translation-utils';

const addAccountPage = new AddAccountPage();
const dashboardPage = new DashboardPage();

/**
 * Test that the app redirects when no accounts in database.
 */
fixture('Dashboard').page(PAGES.DASHBOARD);

test('Should redirect to add-account', async (t) => {
  await addAccountPage.waitPageLoaded();

  const title = getByText(getTransValueByKey('DECRYPT_ACCESS'));
  await t.expect(title.exists).ok();
});

/**
 * Test that the app can load with an existing database.
 */
fixture('Dashboard')
  .clientScripts({ content: injectLS(FIXTURE_LOCALSTORAGE_WITH_ONE_ACC) })
  .page(PAGES.DASHBOARD);

test('Should load dashboard', async () => {
  await dashboardPage.waitPageLoaded();

  const address = Object.values(FIXTURE_LOCALSTORAGE_WITH_ONE_ACC.accounts)[0].address;
  await dashboardPage.expectAddressToBePresent(address);
  await dashboardPage.expectAccountTableToMatchCount(1);
});
