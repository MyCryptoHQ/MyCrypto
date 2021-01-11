import { Selector } from 'testcafe';

import AddAccountPage from './addaccount-page.po';
import { setFeatureFlag } from './featureflag-utils';
import { PAGES } from './fixtures';

const addAccountPage = new AddAccountPage();

fixture('Layout').page(PAGES.DASHBOARD);

test
  .before(async (t) => await t.resizeWindowToFitDevice('iphonexr', { portraitOrientation: true }))
  .after(async (t) => await t.maximizeWindow())(
  'Should correctly order banner and scontainer components in new nav.',
  async (t) => {
    await addAccountPage.waitPageLoaded();

    // This test is meant to be ran against the old nav
    await setFeatureFlag('NEW_NAVIGATION', true);
    await setFeatureFlag('OLD_NAVIGATION', false);

    const demoLayoutWrapper = Selector('main').child(1);
    const bannerWrapperClassNames = (await demoLayoutWrapper.child(1).classNames).reduce(
      (classNamesString, className) => classNamesString + className,
      ''
    );

    await t.expect(bannerWrapperClassNames).contains(`BannerWrapper`);

    const sContainerClassNames = (await demoLayoutWrapper.child(2).classNames).reduce(
      (classNamesString, className) => classNamesString + className,
      ''
    );

    await t.expect(sContainerClassNames).contains(`SContainer`);
  }
);
