import { getByText } from '@testing-library/testcafe';

import { PAGES } from './fixtures';
import { getTransValueByKey } from './translation-utils';

import AddAccountPage from './addaccount-page.po';
// import SettingsPage from './settings-page.po';

const addAccountPage = new AddAccountPage();
// const settingsPage = new SettingsPage();

fixture('Dashboard').page(PAGES.DASHBOARD);

test('Should redirect to add-account', async (t) => {
  await addAccountPage.waitPageLoaded();

  const title = getByText(getTransValueByKey('DECRYPT_ACCESS'));
  await t.expect(title).ok();
});

// @todo Deactivated until we figure if we want to use e2e to test Mnemonic functionnality
// test('Should add account', async () => {
//   await settingsPage.addAccount();
//   await settingsPage.waitForPage(PAGES.DASHBOARD);
// });
