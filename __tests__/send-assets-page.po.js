import { t, Selector } from 'testcafe';
import { getByText } from '@testing-library/testcafe';
import { PAGES, FIXTURE_SEND_CONTACT, FIXTURE_SEND_AMOUNT } from './fixtures';
import BasePage from './base-page.po';
import { getTransValueByKey } from './translation-utils';

export default class SendAssetsPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.SEND);
  }

  async waitPageLoaded() {
    await this.waitForPage(PAGES.SEND);
  }

  async fillForm() {
    await t
      .click(
        Selector('[data-testid="selector"]')
          .find('div')
          .withText(getTransValueByKey('ACCOUNT_LOOKUP_SELECTION_PLACEHOLDER'))
      )
      .click(Selector('div').withExactText(FIXTURE_SEND_CONTACT))
      .click(Selector('input[name="amount"]').parent())
      .typeText(Selector('input[name="amount"]').parent(), FIXTURE_SEND_AMOUNT);

    // Lose focus before trying to click next
    await t
      .click(getByText(getTransValueByKey('SEND_ASSETS')))
      .click(getByText(getTransValueByKey('ACTION_6')));
  }
}
