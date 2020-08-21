import { Selector } from 'testcafe';
import { PAGES } from './fixtures';
import AddAccountPage from './addaccount-page.po';

const addAccountPage = new AddAccountPage();

fixture('Layout').page(PAGES.DASHBOARD);

test
  .before(async (t) => await t.resizeWindowToFitDevice('iphonexr', { portraitOrientation: true }))
  .after(async (t) => await t.maximizeWindow())(
  'Should add top magin to layout that equals to header height',
  async (t) => {
    await addAccountPage.waitPageLoaded();

    const header = Selector('nav');
    const layoutMargin = Selector('main').child(1).getStyleProperty('margin-top');

    const headerHeight = await header.offsetHeight;

    await t.expect(layoutMargin).eql(`${headerHeight}px`);
  }
);
