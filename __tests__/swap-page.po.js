import { getByTestId } from '@testing-library/testcafe';
import { Selector, t } from 'testcafe';

import BasePage from './base-page.po';
import { setupEthereumMock } from './ethereum-mock';
import { FIXTURE_HARDHAT_PRIVATE_KEY, FIXTURE_SEND_AMOUNT, PAGES } from './fixtures';

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

  async fillFormERC20() {
    await t.click(getByTestId('asset-selector-option-ETH'));
    await t.click(getByTestId('asset-selector-option-DAI'));
    await t.typeText(Selector('input[name="swap-from"]').parent(), FIXTURE_SEND_AMOUNT);
  }

  async setupMock() {
    await setupEthereumMock(FIXTURE_HARDHAT_PRIVATE_KEY, 1);
  }
}
