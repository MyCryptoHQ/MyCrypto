import { getByText, queryAllByText } from '@testing-library/testcafe';
import { Selector, t } from 'testcafe';

import BasePage from './base-page.po';
import { setupEthereumMock } from './ethereum-mock';
import {
  FIXTURE_CONTRACT_ALLOWANCE,
  FIXTURE_CONTRACT_BYTECODE,
  FIXTURE_CONTRACT_SPENDER,
  FIXTURE_DAI_ADDRESS,
  FIXTURE_ERC20_ABI_JSON,
  FIXTURE_HARDHAT_PRIVATE_KEY,
  PAGES
} from './fixtures';
import { findByTKey, getTransValueByKey } from './translation-utils';

export default class ContractsPage extends BasePage {
  async waitDeployLoaded(timeout) {
    await this.waitForPage(PAGES.DEPLOY_CONTRACTS, timeout);
  }

  async waitInteractLoaded(timeout) {
    await this.waitForPage(PAGES.INTERACT_WITH_CONTRACTS, timeout);
  }

  async fillDeployForm() {
    await t.typeText(Selector('textarea[name="byteCode"]'), FIXTURE_CONTRACT_BYTECODE, {
      paste: true
    });
  }

  async fillInteractForm() {
    await t
      .typeText(Selector('div[data-testid="selector"]').nth(1).find('input'), FIXTURE_DAI_ADDRESS, {
        paste: true
      })
      .click(getByText(getTransValueByKey('CONTRACT_TITLE')))
      .typeText(Selector('textarea[name="abi"]'), FIXTURE_ERC20_ABI_JSON, {
        paste: true
      })
      .click(queryAllByText(findByTKey('INTERACT_WITH_CONTRACT')).nth(1))
      .click(Selector('div[data-testid="selector"]').nth(2))
      .click(getByText('approve'))
      .typeText(Selector('input').nth(6), FIXTURE_CONTRACT_SPENDER, {
        paste: true
      })
      .typeText(Selector('input').nth(7), FIXTURE_CONTRACT_ALLOWANCE, {
        paste: true
      });
  }

  async setupMock() {
    await setupEthereumMock(FIXTURE_HARDHAT_PRIVATE_KEY, 1);
  }
}
