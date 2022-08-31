import { getByTestId, queryAllByTestId, queryAllByText } from '@testing-library/testcafe';

import { injectLS } from './clientScripts';
import { FIXTURE_HARDHAT, FIXTURES_CONST, PAGES } from './fixtures';
import { resetFork, setupLEND } from './hardhat-utils';
import MigrationPage from './migration-page.po';
import { findByTKey } from './translation-utils';

const migrationPage = new MigrationPage();

fixture('Migration')
  .clientScripts({ content: injectLS(FIXTURE_HARDHAT) })
  .page(PAGES.MIGRATE);

test('can do a LEND migration', async (t) => {
  await resetFork();
  await setupLEND();
  await migrationPage.waitPageLoaded();
  await migrationPage.setupMock();

  await t.wait(FIXTURES_CONST.TIMEOUT);

  const button = await getByTestId('confirm-migrate');
  await t.click(button);

  const approve = await queryAllByText(findByTKey('APPROVE_AAVE_TOKEN_MIGRATION'))
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
});
