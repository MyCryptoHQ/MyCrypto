import { getAllByText, getByText } from '@testing-library/testcafe';
import { Selector, t } from 'testcafe';

import BasePage from './base-page.po';
import { FIXTURE_SEND_AMOUNT, FIXTURE_SEND_CONTACT, PAGES } from './fixtures';
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
    await t.click(getByText(getTransValueByKey('ACTION_6')));
  }
}
