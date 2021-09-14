import { queryAllByTestId, queryAllByText, queryByText } from '@testing-library/testcafe';

import { injectLS } from './clientScripts';
import ContractsPage from './contracts-page.po';
import { FIXTURE_HARDHAT, FIXTURES_CONST, PAGES } from './fixtures';
import { resetFork } from './hardhat-utils';
import { findByTKey } from './translation-utils';

const contractsPage = new ContractsPage();

fixture('Interact with Contracts')
  .clientScripts({ content: injectLS(FIXTURE_HARDHAT) })
  .page(PAGES.INTERACT_WITH_CONTRACTS);

test('Can interact with contract', async (t) => {
  await resetFork();
  await contractsPage.waitInteractLoaded();
  await contractsPage.setupMock();

  await contractsPage.fillInteractForm();

  await t.wait(FIXTURES_CONST.TIMEOUT);

  const button = await queryAllByText(findByTKey('ACTION_17')).nth(1);
  await t.click(button);

  const signBtn = await queryByText(findByTKey('CONFIRM_AND_SEND')).with({
    timeout: FIXTURES_CONST.HARDHAT_TIMEOUT
  });
  await t.expect(signBtn.exists).ok();
  await t.click(signBtn);

  const viewDetailsButton = await queryByText(findByTKey('VIEW_TRANSACTION_DETAILS')).with({
    timeout: FIXTURES_CONST.TIMEOUT
  });
  await t.expect(viewDetailsButton.exists).ok();
  await t.click(viewDetailsButton);

  await t
    .expect(queryAllByTestId('SUCCESS').with({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT }).exists)
    .ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
});

fixture('Deploy Contracts')
  .clientScripts({ content: injectLS(FIXTURE_HARDHAT) })
  .page(PAGES.DEPLOY_CONTRACTS);

test('Can deploy contract', async (t) => {
  await resetFork();
  await contractsPage.waitDeployLoaded();
  await contractsPage.setupMock();

  await contractsPage.fillDeployForm();

  await t.wait(FIXTURES_CONST.TIMEOUT);

  const button = await queryAllByText(findByTKey('NAV_DEPLOYCONTRACT')).nth(1);
  await t.click(button);

  const signBtn = await queryByText(findByTKey('CONFIRM_AND_SEND')).with({
    timeout: FIXTURES_CONST.HARDHAT_TIMEOUT
  });
  await t.expect(signBtn.exists).ok();
  await t.click(signBtn);

  const viewDetailsButton = await queryByText(findByTKey('VIEW_TRANSACTION_DETAILS')).with({
    timeout: FIXTURES_CONST.TIMEOUT
  });
  await t.expect(viewDetailsButton.exists).ok();
  await t.click(viewDetailsButton);

  await t
    .expect(queryAllByTestId('SUCCESS').with({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT }).exists)
    .ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
});
