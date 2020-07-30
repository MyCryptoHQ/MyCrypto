import { getByText, getAllByText } from '@testing-library/testcafe';
import { Selector } from 'testcafe';
import {
  PAGES,
  FIXTURE_LOCALSTORAGE_WITH_ONE_ACC,
  FIXTURE_MYC_STORAGE_KEY,
  ENV,
  FIXTURE_SEND_AMOUNT,
  FIXTURE_SEND_CONTACT
} from './fixtures';
import SendAssetsPage from './send-assets-page.po';
import { getTransValueByKey } from './translation-utils';
import { clearLocalStorage, setLocalStorage } from './localstorage-utils';
import { setFeatureFlag } from './featureflag-utils';

const sendAssetsPage = new SendAssetsPage();

fixture('Send').page(PAGES.SEND);

// PTX
test('Should have and support PTX', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await setLocalStorage(FIXTURE_MYC_STORAGE_KEY, FIXTURE_LOCALSTORAGE_WITH_ONE_ACC);
  await sendAssetsPage.navigateToPage();
  await sendAssetsPage.waitPageLoaded();
  await setFeatureFlag('PROTECT_TX', true);

  const ptxBtn = getByText(getTransValueByKey('PROTECTED_TX_GET_TX_PROTECTION'));
  await t.expect(ptxBtn).ok();

  await t.click(ptxBtn);

  const ptxNextButton = getByText(getTransValueByKey('PROTECTED_TX_PROTECT_MY_TX'));
  await t.expect(ptxNextButton).ok();

  // Information Missing since form isn't filled
  const missingInfo = getByText(getTransValueByKey('MISSING_INFORMATION'));
  await t.expect(missingInfo).ok();
});

test('Should be able to continue to next step', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await setLocalStorage(FIXTURE_MYC_STORAGE_KEY, FIXTURE_LOCALSTORAGE_WITH_ONE_ACC);
  await sendAssetsPage.navigateToPage();
  await sendAssetsPage.waitPageLoaded();

  await sendAssetsPage.fillForm();

  // Has continued to next step with sign button
  await t.expect(getByText(getTransValueByKey('DEP_SIGNTX'))).ok();
});

test('Should be able to send ETH on Ropsten', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await setLocalStorage(FIXTURE_MYC_STORAGE_KEY, FIXTURE_LOCALSTORAGE_WITH_ONE_ACC);
  await sendAssetsPage.navigateToPage();
  await sendAssetsPage.waitPageLoaded();

  await sendAssetsPage.fillForm();

  // Has continued to next step with sign button
  const signBtn = getByText(getTransValueByKey('DEP_SIGNTX'));
  await t.expect(signBtn).ok();

  const inputField = Selector(
    `input[placeholder="${getTransValueByKey('MNEMONIC_ENTER_PHRASE')}"]`
  ).parent();

  await t.click(inputField).typeText(inputField, ENV.E2E_MNEMONIC_PASSPHRASE).click(signBtn);

  // Expect to reach confirm tx
  await t.expect(getByText(getTransValueByKey('CONFIRM_TX_MODAL_TITLE'))).ok();
  await t.expect(getAllByText(FIXTURE_SEND_AMOUNT, { exact: false })).ok();
  await t.expect(getAllByText(FIXTURE_SEND_CONTACT)).ok();

  // Send TX
  await t.click(getByText(new RegExp(getTransValueByKey('CONFIRM_AND_SEND'), 'i')));

  // Expect to reach Tx Receipt
  await t.expect(getByText(getTransValueByKey('TRANSACTION_BROADCASTED_BACK_TO_DASHBOARD'))).ok();
  await t.expect(getAllByText(FIXTURE_SEND_AMOUNT, { exact: false })).ok();
  await t.expect(getAllByText(FIXTURE_SEND_CONTACT)).ok();
});
