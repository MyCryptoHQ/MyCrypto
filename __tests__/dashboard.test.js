import { getByText } from '@testing-library/testcafe';

import AddAccountPage from './addaccount-page.po';
import { PAGES } from './fixtures';
import { getTransValueByKey } from './translation-utils';

const addAccountPage = new AddAccountPage();

fixture('Dashboard').page(PAGES.DASHBOARD);

test('Should redirect to add-account', async (t) => {
  await addAccountPage.waitPageLoaded();

  const title = getByText(getTransValueByKey('DECRYPT_ACCESS'));
  await t.expect(title).ok();
});
