import { getByText } from '@testing-library/testcafe';
import { Selector, t } from 'testcafe';

import BasePage from './base-page.po';
import { setupEthereumMock } from './ethereum-mock';
import {
  FIXTURE_ETHEREUM,
  FIXTURE_HARDHAT_PRIVATE_KEY,
  FIXTURE_VIEW_ONLY_ADDRESS,
  PAGES
} from './fixtures';
import { getTransValueByKey } from './translation-utils';

export default class AddAccountPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.ADD_ACCOUNT);
  }

  async waitPageLoaded(timeToWait) {
    await this.waitForPage(PAGES.ADD_ACCOUNT, timeToWait);
  }

  async addViewOnly() {
    await this.waitPageLoaded();
    await t.click(getByText(getTransValueByKey('VIEW_ADDR')));
    this.waitForPage(PAGES.ADD_ACCOUNT_VIEWONLY);

    await t
      .typeText(Selector('div[data-testid="selector"]').find('input'), FIXTURE_ETHEREUM, {
        paste: true
      })
      .click(Selector('div[data-testid="selector"]').find('span').withText(FIXTURE_ETHEREUM))
      .click(Selector('button').withText(getTransValueByKey('ACTION_6')))
      .typeText(Selector(`div[data-testid="selector"]`).find('input'), FIXTURE_VIEW_ONLY_ADDRESS, {
        paste: true
      })
      // Lose focus
      .click(getByText(getTransValueByKey('INPUT_PUBLIC_ADDRESS_LABEL')))
      .click(Selector('button').withText(getTransValueByKey('ACTION_6')));
  }

  async addWeb3() {
    await this.waitPageLoaded();
    await setupEthereumMock(FIXTURE_HARDHAT_PRIVATE_KEY, 1);
    await t.click(getByText(getTransValueByKey('X_WEB3_DEFAULT')));
    this.waitForPage(PAGES.ADD_ACCOUNT_WEB3);

    await t.click(getByText(getTransValueByKey('ADD_WEB3_DEFAULT')));
  }

  async selectEthereumNetwork() {
    await t
      .typeText(Selector('div[data-testid="selector"]').find('input'), FIXTURE_ETHEREUM, {
        paste: true
      })
      .click(Selector('div[data-testid="selector"]').find('span').withText(FIXTURE_ETHEREUM))
      .click(Selector('button').withText(getTransValueByKey('ACTION_6')));
  }
}
