import { getAllByText, getByText } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

import { resetFeatureFlags, setFeatureFlag } from './featureflag-utils';
import { FIXTURE_SEND_AMOUNT, FIXTURES_CONST, PAGES } from './fixtures';
import { getTransValueByKey } from './translation-utils';
import TxStatusPage from './txstatus-page.po';

const txStatusPage = new TxStatusPage();

fixture('TX Status').page(PAGES.TX_STATUS);

test('Can fetch status of a successful TX', async (t) => {
  await setFeatureFlag('TX_STATUS', true);
  await txStatusPage.waitPageLoaded();

  const title = getByText(getTransValueByKey('TX_STATUS'));
  await t.expect(title).ok();

  await txStatusPage.fillForm();

  await t.wait(FIXTURES_CONST.TIMEOUT);

  await t.expect(Selector('button').withText(getTransValueByKey('FETCH')).exists).eql(false);
  await t.expect(getAllByText(FIXTURE_SEND_AMOUNT, { exact: false })).ok();
  await t.expect(getAllByText(getTransValueByKey('SUCCESS'))).ok();

  await resetFeatureFlags();
});
