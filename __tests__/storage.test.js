import { getByText } from '@testing-library/testcafe';

import AddAccountPage from './addaccount-page.po';
import { FIXTURE_LOCALSTORAGE_WITH_ONE_ACC, FIXTURE_MYC_STORAGE_KEY, PAGES } from './fixtures';
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

// Client Script to set LS before loading the page
// Double stringified as that makes it a valid JS string
const injectLS = `
  console.log('injecting LS');
  localStorage.setItem('${FIXTURE_MYC_STORAGE_KEY}', ${JSON.stringify(
  JSON.stringify(FIXTURE_LOCALSTORAGE_WITH_ONE_ACC)
)});
`;

test.clientScripts({ content: injectLS })('Should apply storage with one account', async () => {
  await settingsPage.navigateToPage();
  await settingsPage.waitPageLoaded();
  await settingsPage.expectAccountTableToMatchCount(1);
});
