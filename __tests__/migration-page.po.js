import BasePage from './base-page.po';
import { setupEthereumMock } from './ethereum-mock';
import { FIXTURE_HARDHAT_PRIVATE_KEY, PAGES } from './fixtures';

export default class MigrationPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.MIGRATE);
  }

  async waitPageLoaded(timeout) {
    await this.waitForPage(PAGES.MIGRATE, timeout);
  }

  async setupMock() {
    await setupEthereumMock(FIXTURE_HARDHAT_PRIVATE_KEY, 1);
  }
}
