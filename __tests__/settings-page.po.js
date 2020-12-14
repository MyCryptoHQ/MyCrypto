import { Selector, t } from 'testcafe';

import BasePage from './base-page.po';
import { PAGES } from './fixtures';

export default class SettingsPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.SETTINGS);
  }

  async waitPageLoaded() {
    await this.waitForPage(PAGES.SETTINGS);
  }

  async expectAccountTableToMatchCount(count) {
    await t.expect(Selector('section:first-of-type > div > table tbody tr').count).eql(count);
  }

  async expectContactTableToMatchCount(count) {
    await t.expect(Selector('section:nth-of-type(2) > div > table tbody tr').count).eql(count);
  }
}
