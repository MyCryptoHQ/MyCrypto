import { getAllByTestId, queryAllByText } from '@testing-library/testcafe';
import { t } from 'testcafe';

import BasePage from './base-page.po';
import { setupEthereumMock } from './ethereum-mock';
import { FIXTURE_HARDHAT_PRIVATE_KEY, PAGES } from './fixtures';
import { findByTKey } from './translation-utils';

export default class MembershipPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.BUY_MEMBERSHIP);
  }

  async waitPageLoaded(timeout) {
    await this.waitForPage(PAGES.BUY_MEMBERSHIP, timeout);
  }

  async useETH() {
    await t.click(getAllByTestId('selector').nth(0));
    await t.click(queryAllByText(findByTKey('MEMBERSHIP_LIFETIME_EMOJI')).nth(0));
  }

  async setupMock() {
    await setupEthereumMock(FIXTURE_HARDHAT_PRIVATE_KEY, 1);
  }
}
