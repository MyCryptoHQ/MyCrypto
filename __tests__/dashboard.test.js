import { getByText } from '@testing-library/testcafe';
import { PAGES } from './fixtures';
import NoAccountsPage from './no-accounts-page.po';
import SettingsPage from './settings-page.po';
import { getTransValueByKey } from './translation-utils';

const noAccountsPage = new NoAccountsPage();
const settingsPage = new SettingsPage();

fixture('Dashboard').page(PAGES.DASHBOARD);

test('Should redirect to no-accounts', async (t) => {
  await noAccountsPage.waitPageLoaded();

  const title = getByText(getTransValueByKey('NO_ACCOUNTS_HEADER'));
  await t.expect(title).ok();
});

// @todo Deactivated until we figure if we want to use e2e to test Mnemonic functionnality
// test('Should add account', async () => {
//   await settingsPage.addAccount();
//   await settingsPage.waitForPage(PAGES.DASHBOARD);
// });
