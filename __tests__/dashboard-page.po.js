import { t, Selector } from 'testcafe';

import { PAGES, FIXTURES_CONST } from './fixtures';
import BasePage from './base-page.po';

export default class DashboardPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.DASHBOARD);
  }

  async waitPageLoaded() {
    await this.waitForPage(PAGES.DASHBOARD);
  }

  async expectAccountTableToMatchCount(count) {
    await t.expect(Selector('section:first-of-type > div > table tbody tr').count).eql(count);
  }

  async expectBalanceInBalanceList(token) {
    await t.expect(Selector('div').withExactText(token)).ok({ timeout: FIXTURES_CONST.TIMEOUT });
  }

  async expectTokenInTokenList(token) {
    await t.expect(Selector('p').withExactText(token)).ok({ timeout: FIXTURES_CONST.TIMEOUT });
  }
}
