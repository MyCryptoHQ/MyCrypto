import { Selector, ClientFunction } from 'testcafe';

import { PAGES } from './fixtures';
import AddAccountPage from './addaccount-page.po';

const addAccount = new AddAccountPage();
fixture('Dashboard').page(PAGES.DASHBOARD);

test('It contains a favicon tag', async (t) => {
  await addAccount.waitPageLoaded();

  const favicon = Selector('head link[rel=icon]');
  const hasHref = await favicon.hasAttribute('href');

  await t.expect(favicon).ok();
  await t.expect(hasHref).ok();
});
