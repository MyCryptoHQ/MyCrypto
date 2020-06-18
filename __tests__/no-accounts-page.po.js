import { PAGES } from './fixtures';
import BasePage from './base-page.po';

export default class NoAccountsPage extends BasePage {
  async waitPageLoaded() {
    await this.waitForPage(PAGES.NO_ACCOUNTS);
  }
}
