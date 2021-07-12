import { getAllByText, getByText, queryByText } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

import { injectLS } from './clientScripts';
import { setupEthereumMock } from './ethereum-mock';
import { setFeatureFlag } from './featureflag-utils';
import {
  FIXTURE_HARDHAT,
  FIXTURE_HARDHAT_PRIVATE_KEY,
  FIXTURE_SEND_AMOUNT,
  FIXTURE_SEND_CONTACT,
  FIXTURES_CONST,
  PAGES
} from './fixtures';
import SendAssetsPage from './send-assets-page.po';
import { findByTKey } from './translation-utils';

const sendAssetsPage = new SendAssetsPage();

fixture('Send')
  .clientScripts({ content: injectLS(FIXTURE_HARDHAT) })
  .page(PAGES.SEND);

test('Complete SendFlow', async (t) => {
  await t.click(getByText(findByTKey('SEND_ASSETS')));

  await sendAssetsPage.waitForPage(PAGES.SEND);

  /* Should have and support PTX */
  await setFeatureFlag('PROTECT_TX', true);

  const ptxBtn = getByText(findByTKey('PROTECTED_TX_GET_TX_PROTECTION'));
  await t.expect(ptxBtn.exists).ok();

  await t.click(ptxBtn);

  const ptxNextButton = getByText(findByTKey('PROTECTED_TX_PROTECT_MY_TX'));
  await t.expect(ptxNextButton.exists).ok();

  // Information Missing since form isn't filled
  const missingInfo = getByText(findByTKey('MISSING_INFORMATION'));
  await t.expect(missingInfo.exists).ok();

  // Close the PTX modal and reset flag.
  await t.click(Selector('.close-icon'));
  await setFeatureFlag('PROTECT_TX', false);

  await setupEthereumMock(FIXTURE_HARDHAT_PRIVATE_KEY, 1);

  /* Can complete form and send tx */
  await sendAssetsPage.fillForm();
  await t.wait(FIXTURES_CONST.TIMEOUT);
  await sendAssetsPage.submitForm();
  await t.wait(FIXTURES_CONST.TIMEOUT);

  // Has continued to next step with sign button
  const signBtn = queryByText(findByTKey('CONFIRM_AND_SEND')).with({
    timeout: FIXTURES_CONST.HARDHAT_TIMEOUT
  });
  await t.expect(signBtn.exists).ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });

  // Expect to reach confirm tx
  await t.expect(getByText(findByTKey('CONFIRM_TX_MODAL_TITLE')).exists).ok();
  await t.expect(getAllByText(FIXTURE_SEND_AMOUNT, { exact: false }).exists).ok();
  await t.expect(getAllByText(FIXTURE_SEND_CONTACT).exists).ok();

  // Send TX
  await t.click(getByText(findByTKey('CONFIRM_AND_SEND')));

  // Expect to reach Tx Receipt
  await t
    .expect(Selector('.TransactionReceipt-back').exists)
    // We are waiting for the Hardhat node to respond. Increase timeout incase of network failures
    .ok({ timeout: FIXTURES_CONST.TIMEOUT * 2 });
  await t.expect(getAllByText(FIXTURE_SEND_AMOUNT, { exact: false }).exists).ok();
  await t.expect(getAllByText(FIXTURE_SEND_CONTACT).exists).ok();
});

test('Valid transaction query params are correctly parsed and loaded into send flow', async (t) => {
  const validQueryParams =
    '?queryType=speedup&gasLimit=0xcb56&chainId=1&nonce=0xD8&gasPrice=0x059682f000&from=0xc6d5a3c98ec9073b54fa0969957bd582e8d874bf&to=0xc6d5a3c98ec9073b54fa0969957bd582e8d874bf&value=0x0&data=0xa9059cbb0000000000000000000000005dd6e754d37bababeb95f34639568812900fec7900000000000000000000000000000000000000000000000000038D7EA4C68000';

  await sendAssetsPage.navigateToPage(validQueryParams);
  await sendAssetsPage.waitPageLoaded(validQueryParams);

  // Expect to reach confirm tx and correctly interpret amount field for erc20 tx
  await t.expect(getByText(findByTKey('CONFIRM_TX_MODAL_TITLE')).exists).ok();
  await t.expect(getAllByText(FIXTURE_SEND_AMOUNT, { exact: false }).exists).ok();
});

test('Shows warning for invalid query params', async (t) => {
  const invalidQueryParams = '?type=speedup&chainId=1';

  await sendAssetsPage.navigateToPage(invalidQueryParams);
  await sendAssetsPage.waitPageLoaded(invalidQueryParams);

  // Should show invalid speedup query params message
  const invalidSpeedUpQueryParamsMessage = Selector('.alert-info');
  await t.expect(invalidSpeedUpQueryParamsMessage.exists).ok();
});
