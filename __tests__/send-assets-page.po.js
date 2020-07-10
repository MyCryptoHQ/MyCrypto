import { PAGES } from './fixtures';
import BasePage from './base-page.po';

export default class SendAssetsPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.SEND);
  }

  async waitPageLoaded() {
    await this.waitForPage(PAGES.SEND);
  }
}
