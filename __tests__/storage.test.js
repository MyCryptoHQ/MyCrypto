import { getByText } from '@testing-library/testcafe';
import {
  FIXTURE_LOCALSTORAGE_EMPTY,
  FIXTURE_LOCALSTORAGE_WITH_ONE_ACC,
  FIXTURE_MYC_STORAGE_KEY,
  PAGES
} from './fixtures';
import AddAccountPage from './addaccount-page.po';
import SettingsPage from './settings-page.po';
import { getTransValueByKey } from './translation-utils';
import { clearLocalStorage, setLocalStorage } from './localstorage-utils';

const addAccountPage = new AddAccountPage();
const settingsPage = new SettingsPage();

fixture('Storage').page(PAGES.DASHBOARD);

test('Should apply empty storage', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await setLocalStorage(FIXTURE_MYC_STORAGE_KEY, FIXTURE_LOCALSTORAGE_EMPTY);

  // localStorage is set after page load, so first navigation should happen
  await addAccountPage.navigateTo(PAGES.DASHBOARD);
  await addAccountPage.waitPageLoaded();

  const title = getByText(getTransValueByKey('DECRYPT_ACCESS'));
  await t.expect(title).ok();
});

test('Should apply storage with one account', async () => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await setLocalStorage(FIXTURE_MYC_STORAGE_KEY, FIXTURE_LOCALSTORAGE_WITH_ONE_ACC);

  await settingsPage.navigateToPage();
  await settingsPage.waitPageLoaded();
  await settingsPage.expectAccountTableToMatchCount(1);
});
