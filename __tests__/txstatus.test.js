import { getAllByTestId, getAllByText, getByText } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

import { injectLS } from './clientScripts';
import { resetFeatureFlags, setFeatureFlag } from './featureflag-utils';
import {
  FIXTURE_HARDHAT,
  FIXTURE_SEND_AMOUNT,
  FIXTURE_WEB3_ADDRESS,
  FIXTURES_CONST,
  PAGES
} from './fixtures';
import { sendTx } from './hardhat-utils';
import { getTransValueByKey } from './translation-utils';
import TxStatusPage from './txstatus-page.po';

const txStatusPage = new TxStatusPage();

fixture('TX Status')
  .clientScripts({ content: injectLS(FIXTURE_HARDHAT) })
  .page(PAGES.TX_STATUS);

test('Can fetch status of a successful TX', async (t) => {
  const hash = await sendTx({
    from: FIXTURE_WEB3_ADDRESS,
    to: FIXTURE_WEB3_ADDRESS,
    value: '0x38d7ea4c68000'
  });
  await setFeatureFlag('TX_STATUS', true);
  await txStatusPage.waitPageLoaded();

  const title = getByText(getTransValueByKey('TX_STATUS'));
  await t.expect(title.exists).ok();

  await txStatusPage.fillForm(hash);

  await t.wait(FIXTURES_CONST.TIMEOUT);

  await t.expect(Selector('button').withText(getTransValueByKey('FETCH')).exists).eql(false);
  await t.expect(getAllByText(FIXTURE_SEND_AMOUNT, { exact: false }).exists).ok();
  await t.expect(getAllByTestId('SUCCESS').exists).ok();

  await resetFeatureFlags();
});
