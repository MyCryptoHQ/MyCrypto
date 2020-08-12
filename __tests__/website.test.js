import { Selector, ClientFunction } from 'testcafe';

import { PAGES } from './fixtures';
import AddAccountPage from './addaccount-page.po';

const addAccount = new AddAccountPage();
fixture('Dashboard').page(PAGES.DASHBOARD);

const getInfo = ClientFunction(() => ({
  domain: document.domain,
  hostname: document.location.hostname
}));

test('It contains a favicon tag', async (t) => {
  await addAccount.waitPageLoaded();

  const favicon = Selector('head link[rel=icon]');
  const hasHref = await favicon.hasAttribute('href');

  await t.expect(favicon).ok();
  await t.expect(hasHref).ok();
});

// For iframe of landing page
// ie. <MigrateLS />
test('It set the correct document.domain per environment', async (t) => {
  const info = await getInfo();
  await t.expect(info.domain).eql(info.hostname);
});
