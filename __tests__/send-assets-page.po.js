import { t, Selector } from 'testcafe';
import { getByText, getAllByText } from '@testing-library/testcafe';
import { PAGES, FIXTURE_SEND_CONTACT, FIXTURE_SEND_AMOUNT } from './fixtures';
import BasePage from './base-page.po';
import { getTransValueByKey } from './translation-utils';

export default class SendAssetsPage extends BasePage {
  async navigateToPage(queryString) {
    this.navigateTo(`${PAGES.SEND}/${queryString}`);
  }

  async waitPageLoaded(queryString) {
    await this.waitForPage(`${PAGES.SEND}/${queryString}`);
  }

  async fillForm() {
    await t
      .click(getByText(getTransValueByKey('ACCOUNT_LOOKUP_SELECTION_PLACEHOLDER')))
      .click(getAllByText(FIXTURE_SEND_CONTACT).nth(1))
      .click(Selector('input[name="amount"]').parent())
      .typeText(Selector('input[name="amount"]').parent(), FIXTURE_SEND_AMOUNT);
  }
  async submitForm() {
    // Lose focus before trying to click next
    await t
      .click(getByText(getTransValueByKey('SEND_ASSETS')))
      .click(getByText(getTransValueByKey('ACTION_6')));
  }
}
