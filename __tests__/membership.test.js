import {
  getByText,
  queryAllByTestId,
  queryAllByText,
  queryByText
} from '@testing-library/testcafe';

import { injectLS } from './clientScripts';
import DashboardPage from './dashboard-page.po';
import { FIXTURE_HARDHAT, FIXTURES_CONST, PAGES } from './fixtures';
import { resetFork, setupDAI } from './hardhat-utils';
import MembershipPage from './membership-page.po';
import { findByTKey } from './translation-utils';

const membershipPage = new MembershipPage();
const dashboard = new DashboardPage();

fixture('Membership')
  .clientScripts({ content: injectLS(FIXTURE_HARDHAT) })
  .page(PAGES.BUY_MEMBERSHIP);

test('can buy with ETH', async (t) => {
  await membershipPage.waitPageLoaded();
  await membershipPage.setupMock();
  await resetFork();

  await membershipPage.useETH();

  await t.wait(FIXTURES_CONST.TIMEOUT);

  const button = await getByText(findByTKey('BUY_MEMBERSHIP'));
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

test('can buy with DAI', async (t) => {
  await resetFork();
  await setupDAI();
  await membershipPage.waitPageLoaded();
  await membershipPage.setupMock();

  await t.wait(FIXTURES_CONST.TIMEOUT);

  const button = await getByText(findByTKey('BUY_MEMBERSHIP'));
  await t.click(button);

  const approve = await queryAllByText(findByTKey('APPROVE_MEMBERSHIP'))
    .with({
      timeout: FIXTURES_CONST.HARDHAT_TIMEOUT
    })
    .nth(1);
  await t.expect(approve.exists).ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
  await t.click(approve);

  await t.wait(FIXTURES_CONST.TIMEOUT);

  const send = await queryAllByText(findByTKey('CONFIRM_TRANSACTION'))
    .with({
      timeout: FIXTURES_CONST.HARDHAT_TIMEOUT
    })
    .nth(1);
  await t.expect(send.exists).ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
  await t.click(send);

  await t
    .expect(queryAllByTestId('SUCCESS').with({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT }).count)
    .eql(2, { timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });

  const home = await queryByText(findByTKey('NAVIGATION_HOME'));
  await t.click(home);

  await dashboard.waitPageLoaded();
  const request = await queryByText(findByTKey('MANAGE_MEMBERSHIP'), { exact: false });

  await t.expect(request.exists).ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
});
