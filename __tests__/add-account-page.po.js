import { PAGES } from './fixtures';
import BasePage from './base-page.po';

export default class AddAccountsPage extends BasePage {
  async waitPageLoaded() {
    await this.waitForPage(PAGES.ADD_ACCOUNT);
  }
}
