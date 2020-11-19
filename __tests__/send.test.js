import { getAllByText, getByText } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

import { setupEthereumMock } from './ethereum-mock';
import { setFeatureFlag } from './featureflag-utils';
import {
  ENV,
  FIXTURE_LOCALSTORAGE_WITH_ONE_ACC,
  FIXTURE_MYC_STORAGE_KEY,
  FIXTURE_SEND_AMOUNT,
  FIXTURE_SEND_CONTACT,
  FIXTURES_CONST,
  PAGES
} from './fixtures';
import { clearLocalStorage, setLocalStorage } from './localstorage-utils';
import SendAssetsPage from './send-assets-page.po';
import { findByTKey } from './translation-utils';

const sendAssetsPage = new SendAssetsPage();

fixture('Send').page(PAGES.SEND);

test('Complete SendFlow', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await setLocalStorage(FIXTURE_MYC_STORAGE_KEY, FIXTURE_LOCALSTORAGE_WITH_ONE_ACC);

  const invalidQueryParams = '?type=speedup&chainId=1';

  await sendAssetsPage.navigateToPage(invalidQueryParams);
  await sendAssetsPage.waitPageLoaded(invalidQueryParams);

  /* Should have and support PTX */
  await setFeatureFlag('PROTECT_TX', true);

  const ptxBtn = getByText(findByTKey('PROTECTED_TX_GET_TX_PROTECTION'));
  await t.expect(ptxBtn).ok();

  // Should show invalid speedup query params message
  const invalidSpeedUpQueryParamsMessage = Selector('.alert-info');
  await t.expect(invalidSpeedUpQueryParamsMessage.exists).ok();

  await t.click(ptxBtn);

  const ptxNextButton = getByText(findByTKey('PROTECTED_TX_PROTECT_MY_TX'));
  await t.expect(ptxNextButton).ok();

  // Information Missing since form isn't filled
  const missingInfo = getByText(findByTKey('MISSING_INFORMATION'));
  await t.expect(missingInfo).ok();

  // Close the PTX modal and reset flag.
  await t.click(Selector('.close-icon'));
  await setFeatureFlag('PROTECT_TX', false);

  await setupEthereumMock(ENV.E2E_PRIVATE_KEY, 5);

  /* Can complete form and send tx */
  await sendAssetsPage.fillForm();
  await sendAssetsPage.submitForm();

  // Has continued to next step with sign button
  const signBtn = getByText(findByTKey('CONFIRM_AND_SEND'));
  await t.expect(signBtn).ok();

  // Expect to reach confirm tx
  await t.expect(getByText(findByTKey('CONFIRM_TX_MODAL_TITLE'))).ok();
  await t.expect(getAllByText(FIXTURE_SEND_AMOUNT, { exact: false })).ok();
  await t.expect(getAllByText(FIXTURE_SEND_CONTACT)).ok();

  // Send TX
  await t.click(getByText(findByTKey('CONFIRM_AND_SEND')));

  // Expect to reach Tx Receipt
  await t
    .expect(Selector('.TransactionReceipt-back').exists)
    .ok({ timeout: FIXTURES_CONST.TIMEOUT });
  await t.expect(getAllByText(FIXTURE_SEND_AMOUNT, { exact: false })).ok();
  await t.expect(getAllByText(FIXTURE_SEND_CONTACT)).ok();
});

test('Valid transaction query params are correctly parsed and loaded into send flow', async (t) => {
  const validQueryParams =
    '?type=speedup&gasLimit=0xcb56&chainId=1&nonce=0xD8&gasPrice=0x059682f000&from=0x32F08711dC8ca3EB239e01f427AE3713DB1f6Be3&to=0x6B175474E89094C44Da98b954EedeAC495271d0F&value=0x0&data=0xa9059cbb0000000000000000000000005dd6e754d37bababeb95f34639568812900fec7900000000000000000000000000000000000000000000000000038D7EA4C68000';

  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await setLocalStorage(FIXTURE_MYC_STORAGE_KEY, FIXTURE_LOCALSTORAGE_WITH_ONE_ACC);
  await sendAssetsPage.navigateToPage(validQueryParams);
  await sendAssetsPage.waitPageLoaded(validQueryParams);

  // Expect to reach confirm tx and correctly interpret amount field for erc20 tx
  await t.expect(getByText(findByTKey('CONFIRM_TX_MODAL_TITLE'))).ok();
  await t.expect(getAllByText(FIXTURE_SEND_AMOUNT, { exact: false })).ok();
});
