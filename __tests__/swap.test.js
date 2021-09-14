import {
  getByTestId,
  queryAllByTestId,
  queryAllByText,
  queryByText
} from '@testing-library/testcafe';

import { injectLS } from './clientScripts';
import DashboardPage from './dashboard-page.po';
import { FIXTURE_HARDHAT, FIXTURES_CONST, PAGES } from './fixtures';
import { resetFork, setupDAI } from './hardhat-utils';
import SwapPage from './swap-page.po';
import { findByTKey } from './translation-utils';

const swapPage = new SwapPage();
const dashboardPage = new DashboardPage();

fixture('Swap')
  .clientScripts({ content: injectLS(FIXTURE_HARDHAT) })
  .page(PAGES.SWAP);

test('can do an ETH swap', async (t) => {
  await swapPage.waitPageLoaded();
  await swapPage.setupMock();
  await resetFork(false);

  await swapPage.fillForm();
  await t.wait(FIXTURES_CONST.TIMEOUT);

  const button = await getByTestId('confirm-swap');
  await t.click(button);

  const send = await queryByText(findByTKey('CONFIRM_AND_SEND')).with({
    timeout: FIXTURES_CONST.HARDHAT_TIMEOUT
  });
  await t.expect(send.exists).ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
  await t.click(send);

  const viewDetailsButton = await queryByText(findByTKey('VIEW_TRANSACTION_DETAILS')).with({
    timeout: FIXTURES_CONST.TIMEOUT
  });
  await t.expect(viewDetailsButton.exists).ok();
  await t.click(viewDetailsButton);

  await t
    .expect(queryAllByTestId('SUCCESS').with({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT }).exists)
    .ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
});

test('can do an ERC20 swap', async (t) => {
  await resetFork(false);
  await setupDAI();
  await swapPage.waitPageLoaded();
  await swapPage.setupMock();

  await swapPage.fillFormERC20();
  await t.wait(FIXTURES_CONST.TIMEOUT);

  const button = await getByTestId('confirm-swap');
  await t.click(button);

  const approve = await queryAllByText(findByTKey('APPROVE_SWAP'))
    .with({
      timeout: FIXTURES_CONST.HARDHAT_TIMEOUT
    })
    .nth(1);
  await t.expect(approve.exists).ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
  await t.click(approve);

  await t.wait(FIXTURES_CONST.TIMEOUT);

  const send = await queryByText(findByTKey('CONFIRM_TRANSACTION')).with({
    timeout: FIXTURES_CONST.HARDHAT_TIMEOUT
  });
  await t.expect(send.exists).ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
  await t.click(send);

  await t
    .expect(queryAllByTestId('SUCCESS').with({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT }).count)
    .eql(2, { timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });

  const home = await queryByText(findByTKey('NAVIGATION_HOME'));
  await t.click(home);

  await dashboardPage.waitPageLoaded();
  const balance = await queryAllByText('1INCH', { exact: false });

  await t.expect(balance.exists).ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
});
