import { t, Selector } from 'testcafe';

import { PAGES, FIXTURE_ETHEREUM, FIXTURE_VIEW_ONLY_ADDRESS } from './fixtures';
import BasePage from './base-page.po';
import { getTransValueByKey } from './translation-utils';
import { getByText } from '@testing-library/testcafe';

export default class AddAccountPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.ADD_ACCOUNT);
  }

  async waitPageLoaded() {
    await this.waitForPage(PAGES.ADD_ACCOUNT);
  }

  async addViewOnly() {
    await this.navigateToPage();
    await this.waitPageLoaded();
    await t.click(getByText(getTransValueByKey('VIEW_ADDR')));
    this.waitForPage(PAGES.ADD_ACCOUNT_VIEWONLY);

    await t
      .typeText(Selector('div[data-testid="selector"]').find('input'), FIXTURE_ETHEREUM)
      .click(Selector('div[data-testid="selector"]').find('span').withText(FIXTURE_ETHEREUM))
      .click(Selector('button').withText(getTransValueByKey('ACTION_6')))
      .typeText(Selector(`div[data-testid="selector"]`).find('input'), FIXTURE_VIEW_ONLY_ADDRESS)
      // Lose focus
      .click(getByText(getTransValueByKey('INPUT_PUBLIC_ADDRESS_LABEL')))
      .click(Selector('button').withText(getTransValueByKey('ACTION_6')));
  }
}
