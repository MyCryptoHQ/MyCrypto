import { getByTestId, queryAllByTestId, queryByText } from '@testing-library/testcafe';

import { injectLS } from './clientScripts';
import { FIXTURE_HARDHAT, FIXTURES_CONST, PAGES } from './fixtures';
import SwapPage from './swap-page.po';
import { findByTKey } from './translation-utils';

const swapPage = new SwapPage();

fixture('Swap')
  .clientScripts({ content: injectLS(FIXTURE_HARDHAT) })
  .page(PAGES.SWAP);

test('can do a swap', async (t) => {
  await swapPage.waitPageLoaded();
  await swapPage.setupMock();

  await swapPage.fillForm();
  await t.wait(FIXTURES_CONST.TIMEOUT);

  const button = await getByTestId('confirm-swap');
  await t.click(button);

  const send = await queryByText(findByTKey('CONFIRM_AND_SEND')).with({
    timeout: FIXTURES_CONST.HARDHAT_TIMEOUT
  });
  await t.expect(send.exists).ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
  await t.click(send);

  await t
    .expect(queryAllByTestId('SUCCESS').with({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT }).exists)
    .ok({ timeout: FIXTURES_CONST.HARDHAT_TIMEOUT });
});
