import { getByText } from '@testing-library/testcafe';

import { injectLS } from './clientScripts';
import { FIXTURE_LOCALSTORAGE_WITH_ONE_ACC, FIXTURES_CONST, PAGES } from './fixtures';
import SwapPage from './swap-page.po';
import { findByTKey } from './translation-utils';

const swapPage = new SwapPage();

fixture('Swap')
  .clientScripts({ content: injectLS(FIXTURE_LOCALSTORAGE_WITH_ONE_ACC) })
  .page(PAGES.SWAP);

test('Can get swap quote', async (t) => {
  await swapPage.waitPageLoaded();

  /* Fill out form */
  await swapPage.fillForm();
  await t.wait(FIXTURES_CONST.TIMEOUT);

  // Has received swap quote
  const quote = await getByText(findByTKey('YOUR_QUOTE'));
  await t.expect(quote).ok();
});
