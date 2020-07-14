import { getByText } from '@testing-library/testcafe';
import { Selector } from 'testcafe';
import {
  PAGES,
  FIXTURE_LOCALSTORAGE_WITH_ONE_ACC,
  FIXTURE_MYC_STORAGE_KEY,
  FIXTURE_SEND_CONTACT,
  FIXTURE_SEND_ADDRESS,
  FIXTURE_SEND_AMOUNT
} from './fixtures';
import SendAssetsPage from './send-assets-page.po';
import { getTransValueByKey } from './translation-utils';
import { clearLocalStorage, setLocalStorage } from './localstorage-utils';

const sendAssetsPage = new SendAssetsPage();

fixture('Send').page(PAGES.SEND);

test('Should be able to continue to next step', async (t) => {
  await clearLocalStorage(FIXTURE_MYC_STORAGE_KEY);
  await setLocalStorage(FIXTURE_MYC_STORAGE_KEY, FIXTURE_LOCALSTORAGE_WITH_ONE_ACC);
  await sendAssetsPage.navigateToPage();
  await sendAssetsPage.waitPageLoaded();

  await t
    .click(
      Selector('.Select')
        .find('div')
        .withText(getTransValueByKey('ACCOUNT_LOOKUP_SELECTION_PLACEHOLDER'))
    )
    .click(Selector('div').withText(FIXTURE_SEND_CONTACT))
    .click(Selector('input[name="amount"]').parent())
    .typeText(Selector('input[name="amount"]').parent(), FIXTURE_SEND_AMOUNT);

  // Lose focus before trying to click next
  await t
    .click(getByText(getTransValueByKey('SEND_ASSETS')))
    .click(getByText(getTransValueByKey('ACTION_6')));

  // Has continued to next step with sign button
  await t.expect(Selector('*').withText(getTransValueByKey('DEP_SIGNTX'))).ok();
});
