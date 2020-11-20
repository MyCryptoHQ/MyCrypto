import { getByText } from '@testing-library/testcafe';

import AddAccountPage from './addaccount-page.po';
import { PAGES } from './fixtures';
import { withLS } from './roles';
import SettingsPage from './settings-page.po';
import { getTransValueByKey } from './translation-utils';

const addAccountPage = new AddAccountPage();
const settingsPage = new SettingsPage();

fixture('Storage').page(PAGES.DASHBOARD);

test('Should apply empty storage', async (t) => {
  // localStorage is set after page load, so first navigation should happen
  await addAccountPage.navigateTo(PAGES.DASHBOARD);
  await addAccountPage.waitPageLoaded();

  const title = getByText(getTransValueByKey('DECRYPT_ACCESS'));
  await t.expect(title).ok();
});

test.before(async (t) => {
  await t.useRole(withLS);
})('Should apply storage with one account', async (t) => {
  await t.debug();
  await settingsPage.navigateToPage();
  await settingsPage.waitPageLoaded();
  await settingsPage.expectAccountTableToMatchCount(1);
});
