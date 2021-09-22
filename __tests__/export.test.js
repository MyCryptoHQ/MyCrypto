import { getByTestId, getByText } from '@testing-library/testcafe';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { lensPath, omit, pipe, set } from 'ramda';
import { ClientFunction } from 'testcafe';
import timeLimit from 'time-limit-promise';

import { injectLS } from './clientScripts';
import { FIXTURE_LOCALSTORAGE_WITH_ONE_ACC, FIXTURES_CONST, PAGES } from './fixtures';
import SettingsPage from './settings-page.po';
import { getTransValueByKey } from './translation-utils';

function getFilePath(fileName) {
  return join(homedir(), 'Downloads', fileName);
}

async function waitForFile(path) {
  while (!existsSync(path)) await setTimeout(() => {}, FIXTURES_CONST.TIMEOUT);
}

async function waitForFileWithTimeout(path, ms) {
  await timeLimit(waitForFile(path), ms, {
    rejectWith: new Error('Timed out when waiting for a file')
  });
}

const settingsPage = new SettingsPage();

fixture('Settings/Export')
  .clientScripts({ content: injectLS(FIXTURE_LOCALSTORAGE_WITH_ONE_ACC) })
  .page(PAGES.SETTINGS);

test('Can export AppState to file', async (t) => {
  await settingsPage.waitPageLoaded();

  // Navigate to Export page
  const getCurrentLocationUrl = ClientFunction(() => window.location.href);
  await t
    .click(getByText(getTransValueByKey('SETTINGS_EXPORT_LABEL')))
    .expect(getCurrentLocationUrl())
    .eql(PAGES.SETTINGS_EXPORT, {
      timeout: FIXTURES_CONST.TIMEOUT
    });

  // Assert the json is displayed in a code block
  await t.expect(getByTestId('export-json-display').exists).ok();

  // Download file
  const downloadBtn = getByTestId('export-json-link'); // Button is inside link, so to acess attr we use data-testid
  await t.expect(downloadBtn.exists).ok();
  await t.click(downloadBtn);

  // Check for file download every x seconds and assert it actual contents match fixture
  const fileName = await downloadBtn.getAttribute('download');
  const filePath = getFilePath(fileName);
  await waitForFileWithTimeout(filePath, FIXTURES_CONST.TIMEOUT);

  // mtime and balances are dynamic values.
  // remove them before we assert equality.
  const removeKeysFromAccountAsset = omit(['mtime', 'balance']);
  const accountAssetsLens = lensPath([
    'accounts',
    '1782c060-8bc0-55d6-8078-ff255b4aae90', // First account in account object.
    'assets',
    0 // First asset in asset list.
  ]);

  // analyticsUserID is a dynamic value.
  // remove it before we assert equality.
  const removeKeysFromAccountSettings = omit(['analyticsUserID']);
  const accountSettingsLens = lensPath(['settings']);

  const omitDynamicValues = pipe(
    omit(['mtime']),
    set(accountAssetsLens, removeKeysFromAccountAsset),
    set(accountSettingsLens, removeKeysFromAccountSettings)
  );

  const actual = omitDynamicValues(JSON.parse(readFileSync(filePath)));
  const expected = omitDynamicValues(FIXTURE_LOCALSTORAGE_WITH_ONE_ACC);
  await t.expect(actual).eql(expected);

  // Clean up
  unlinkSync(filePath);
});
