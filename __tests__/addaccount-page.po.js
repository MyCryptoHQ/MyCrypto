import { t, Selector } from 'testcafe';

import { PAGES, FIXTURE_ETHEREUM, FIXTURE_VIEW_ONLY_ADDRESS, FIXTURE_TEST_PRIVATE_KEY, FIXTURE_TEST_KEYSTORE_FILE_PASSWORD, FIXTURES_CONST } from './fixtures';
import BasePage from './base-page.po';
import { getTransValueByKey } from './translation-utils';
import { getByText } from '@testing-library/testcafe';
import { placeholder } from 'modernizr';

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

  async addPrivateKey() {
    await this.navigateToPage();
    await this.waitPageLoaded();
    await t.click(getByText(getTransValueByKey('X_PRIVKEY2')));
    this.waitForPage(PAGES.ADD_ACCOUNT_PRIVATE_KEY);

    await t
      .typeText(Selector('div[data-testid="selector"]').find('input'), FIXTURE_ETHEREUM)
      .click(Selector('div[data-testid="selector"]').find('span').withText(FIXTURE_ETHEREUM))
      .click(Selector('button').withText(getTransValueByKey('ACTION_6')))
      .typeText(Selector(`div`).withText(getTransValueByKey('PRIVATE_KEY_PLACEHOLDER')).find('input'), FIXTURE_TEST_PRIVATE_KEY)

    // Lose focus
    await t.expect(Selector('button').withText(getTransValueByKey('ADD_LABEL_6_SHORT')).hasAttribute('disabled')).notOk('ready for testing', { timeout: FIXTURES_CONST.TIMEOUT });
    await t.click(Selector('button').withText(getTransValueByKey('ADD_LABEL_6_SHORT')));
  }

  async addKeystoreFile() {
    await this.navigateToPage();
    await this.waitPageLoaded(FIXTURES_CONST.TIMEOUT * 2);
    await t.click(getByText(getTransValueByKey('X_KEYSTORE2')));
    this.waitForPage(PAGES.ADD_ACCOUNT_KEYSTORE);

    // Select Ethereum Network and upload keystore file
    await t
      .typeText(Selector('div[data-testid="selector"]').find('input'), FIXTURE_ETHEREUM)
      .click(Selector('div[data-testid="selector"]').find('span').withText(FIXTURE_ETHEREUM))
      .click(Selector('button').withText(getTransValueByKey('ACTION_6')))
      .setFilesToUpload(Selector(`div`).withText(getTransValueByKey('ADD_RADIO_2_SHORT')).find('input'), './testKeystoreFile.json')

    // Inpute keystore password
    await t.typeText(Selector(`input`).withAttribute('placeholder', getTransValueByKey('INPUT_PASSWORD_LABEL')), FIXTURE_TEST_KEYSTORE_FILE_PASSWORD)

    // Lose focus
    await t.expect(Selector('button').withText(getTransValueByKey('ADD_LABEL_6_SHORT')).hasAttribute('disabled')).notOk('ready for testing', { timeout: FIXTURES_CONST.TIMEOUT });
    await t.click(Selector('button').withText(getTransValueByKey('ADD_LABEL_6_SHORT')));
  }
}
