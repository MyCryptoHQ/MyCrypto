import { t, Selector } from 'testcafe';

import {
  PAGES,
  FIXTURE_ETHEREUM,
  FIXTURE_VIEW_ONLY_ADDRESS,
  FIXTURE_TEST_PRIVATE_KEY,
  FIXTURE_TEST_KEYSTORE_FILE_PASSWORD
} from './fixtures';
import BasePage from './base-page.po';
import { findByTKey, getTransValueByKey } from './translation-utils';
import { getByText } from '@testing-library/testcafe';

export default class AddAccountPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.ADD_ACCOUNT);
  }

  async waitPageLoaded(timeToWait) {
    await this.waitForPage(PAGES.ADD_ACCOUNT, timeToWait);
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

  async selectEthereumNetwork() {
    await t
      .typeText(Selector('div[data-testid="selector"]').find('input'), FIXTURE_ETHEREUM)
      .click(Selector('div[data-testid="selector"]').find('span').withText(FIXTURE_ETHEREUM))
      .click(Selector('button').withText(getTransValueByKey('ACTION_6')));
  }
  // Add Account Private Key
  async selectPrivateKeyWalletType() {
    await this.navigateToPage();
    await this.waitPageLoaded();
    await t.click(getByText(getTransValueByKey('X_PRIVKEY2')));
  }

  async inputPrivateKey() {
    await t.typeText(
      Selector(`div`).withText(getTransValueByKey('PRIVATE_KEY_PLACEHOLDER')).find('input'),
      FIXTURE_TEST_PRIVATE_KEY
    );
  }

  async submitAddAccountPrivateKey() {
    await t.click(Selector('button').withText(getTransValueByKey('ADD_LABEL_6_SHORT')));
  }

  // Add Account Keystore File
  async selectKeystoreFileWalletType() {
    await this.navigateToPage();
    await this.waitPageLoaded();
    await t.click(getByText(findByTKey('X_KEYSTORE2')));
  }
  async inputKeystoreFileAndPassword() {
    // Select Ethereum Network and upload keystore file
    await t.setFilesToUpload(
      Selector(`div`).withText(getTransValueByKey('ADD_RADIO_2_SHORT')).find('input'),
      './fixtures/testKeystoreFile.json'
    );

    // Inpute keystore password
    await t.typeText(
      Selector(`input`).withAttribute('placeholder', getTransValueByKey('INPUT_PASSWORD_LABEL')),
      FIXTURE_TEST_KEYSTORE_FILE_PASSWORD
    );
  }

  async submitAddAccountKeystoreFile() {
    await t.click(Selector('button').withText(getTransValueByKey('ADD_LABEL_6_SHORT')));
  }
}
