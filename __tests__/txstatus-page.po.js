import { Selector, t } from 'testcafe';

import BasePage from './base-page.po';
import { FIXTURE_ETHEREUM, PAGES } from './fixtures';
import { getTransValueByKey } from './translation-utils';

export default class TxStatusPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.TX_STATUS);
  }

  async waitPageLoaded(timeout) {
    await this.waitForPage(PAGES.TX_STATUS, timeout);
  }

  async fillForm(hash) {
    await t
      .click(Selector('div[data-testid="selector"]'))
      .click(Selector('div[data-testid="selector"]').find('span').withText(FIXTURE_ETHEREUM))
      .typeText(Selector(`input[name="txhash"]`), hash, { paste: true })
      .click(Selector('button').withText(getTransValueByKey('FETCH')));
  }
}
