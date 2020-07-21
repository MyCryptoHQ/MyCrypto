import { Selector } from 'testcafe';
import { PAGES } from './fixtures';
import NoAccountsPage from './no-accounts-page.po';

const noAccountsPage = new NoAccountsPage();

fixture('Layout').page(PAGES.DASHBOARD);

test('Should add top magin to layout that equals to header height', async (t) => {
  await noAccountsPage.waitPageLoaded();

  await t.resizeWindowToFitDevice('iphonexr', { portraitOrientation: true });

  const header = Selector('nav');
  const layoutMargin = Selector('main').child(1).getStyleProperty('margin-top');

  const headerHeight = await header.offsetHeight;

  await t.expect(layoutMargin).eql(`${headerHeight}px`);
});

// @todo Deactivated until we figure if we want to use e2e to test Mnemonic functionnality
// test('Should add account', async () => {
//   await settingsPage.addAccount();
//   await settingsPage.waitForPage(PAGES.DASHBOARD);
// });
