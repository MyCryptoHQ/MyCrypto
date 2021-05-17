import { Selector, t } from 'testcafe';

import BasePage from './base-page.po';
import { FIXTURE_SEND_AMOUNT, PAGES } from './fixtures';

export default class SwapPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.SWAP);
  }

  async waitPageLoaded(timeout) {
    await this.waitForPage(PAGES.SWAP, timeout);
  }

  async fillForm() {
    await t.typeText(Selector('input[name="swap-from"]').parent(), FIXTURE_SEND_AMOUNT);
  }
}
