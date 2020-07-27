import { Selector, ClientFunction } from 'testcafe';
import request from 'request';

import { PAGES } from './fixtures';
import NoAccountsPage from './no-accounts-page.po';

const noAccounts = new NoAccountsPage();
const getHost = ClientFunction(() => window.location.host);
fixture('Dashboard').page(PAGES.DASHBOARD);

test('It contains a favicon tag', async (t) => {
  await noAccounts.waitPageLoaded();

  const favicon = Selector('head link[rel=icon]');
  const hasHref = await favicon.hasAttribute('href');

  await t.expect(favicon).ok();
  await t.expect(hasHref).ok();
});
