import { getByTestId, getByText } from '@testing-library/testcafe';
import { ClientFunction } from 'testcafe';

import { FIXTURES_CONST, PAGES } from './fixtures';
import importable from './fixtures/persisted.json';
import SettingsPage from './settings-page.po';
import { getTransValueByKey } from './translation-utils';

const settingsPage = new SettingsPage();

fixture('Settings/Import').page(PAGES.SETTINGS);

test('Can import AppState from file', async (t) => {
  await settingsPage.waitPageLoaded();

  const getCurrentLocationUrl = ClientFunction(() => window.location.href);
  await t
    .click(getByText(getTransValueByKey('SETTINGS_IMPORT')))
    .expect(getCurrentLocationUrl())
    .eql(PAGES.SETTINGS_IMPORT, {
      timeout: FIXTURES_CONST.TIMEOUT
    });

  const btn = getByText(getTransValueByKey('SETTINGS_IMPORT_COMPLETE'));
  await t
    .setFilesToUpload(getByTestId('upload-input'), ['./fixtures/persisted.json'])
    .expect(btn.exists)
    .ok()
    .click(btn)
    .expect(getCurrentLocationUrl())
    .eql(PAGES.SETTINGS, { timeout: FIXTURES_CONST.TIMEOUT })
    // The file sets the Ethereum selectedNode to a custom node named "Emmanuel Macron"
    .expect(getByText(/Emmanuel Macron/).exists)
    .ok();

  await settingsPage.expectAccountTableToMatchCount(Object.keys(importable.accounts).length);
  await settingsPage.expectContactTableToMatchCount(Object.keys(importable.addressBook).length);
});
