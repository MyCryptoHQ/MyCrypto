import { t, Selector } from 'testcafe';
import { ENV, NETWORK_NAME_FIXTURE, PAGES } from './fixtures';
import BasePage from './base-page.po';
import { getTransValueByKey } from './translation-utils';

export default class SettingsPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.SETTINGS);
  }

  async waitPageLoaded() {
    await this.waitForPage(PAGES.SETTINGS);
  }

  async addAccount() {
    this.navigateTo(PAGES.ADD_ACCOUNT_MNEMONIC);
    this.waitForPage(PAGES.ADD_ACCOUNT_MNEMONIC);

    await t
      .typeText(Selector('.Select-input').find('input'), NETWORK_NAME_FIXTURE)
      .click(Selector('.Select-menu').find('span').withText(NETWORK_NAME_FIXTURE))
      .click(Selector('button').withText(getTransValueByKey('ACTION_6')))
      .typeText(
        Selector(`input[placeholder="${getTransValueByKey('X_MNEMONIC')}"]`),
        ENV.E2E_MNEMONIC_PASSPHRASE
      )
      .click(Selector('button').withText(getTransValueByKey('MNEMONIC_CHOOSE_ADDR')))
      .click(Selector('table tbody tr:first-child td'))
      .click(Selector('button').withText(getTransValueByKey('ACTION_6')));
  }

  async expectAccountTableToMatchCount(count) {
    await t.expect(Selector('section:first-of-type > div > table tbody tr').count).eql(count);
  }
}
