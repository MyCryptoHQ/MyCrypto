import { getByText } from '@testing-library/testcafe';

import AddAccountPage from './addaccount-page.po';
import { injectLS } from './clientScripts';
import { FIXTURE_LOCALSTORAGE_WITH_ONE_ACC, PAGES } from './fixtures';
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
  await t.expect(title.exists).ok();
});

test.clientScripts({ content: injectLS(FIXTURE_LOCALSTORAGE_WITH_ONE_ACC) })(
  'Should apply storage with one account',
  async () => {
    await settingsPage.navigateToPage();
    await settingsPage.waitPageLoaded();
    await settingsPage.expectAccountTableToMatchCount(1);
  }
);
