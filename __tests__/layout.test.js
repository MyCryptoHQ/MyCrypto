import { Selector } from 'testcafe';

import AddAccountPage from './addaccount-page.po';
import { PAGES } from './fixtures';

const addAccountPage = new AddAccountPage();

fixture('Layout').page(PAGES.DASHBOARD);

test
  .before(async (t) => await t.resizeWindowToFitDevice('iphonexr', { portraitOrientation: true }))
  .after(async (t) => await t.maximizeWindow())(
  'Should add top margin to layout that equals to header height',
  async (t) => {
    await addAccountPage.waitPageLoaded();

    const banner = Selector('main').child(1);
    const layoutMargin = Selector('main').child(2).getStyleProperty('margin-top');
    const bannerHeight = await banner.offsetHeight;

    await t.expect(layoutMargin).eql(`${bannerHeight}px`);
  }
);
