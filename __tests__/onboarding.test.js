import { getAllByText } from '@testing-library/testcafe';

import { PAGES } from './fixtures';
import OnboardingPage from './onboarding-page.po';

const onboardingPage = new OnboardingPage();

fixture('Onboarding').page(PAGES.ONBOARDING);

test('Should be able to show a custodial exchange onboarding', async (t) => {
  await onboardingPage.navigateToPage('kraken');
  await onboardingPage.waitPageLoaded('kraken');

  const title = getAllByText('Kraken');
  await t.expect(title.exists).ok();
});

test('Should be able to show a non-custodial exchange onboarding', async (t) => {
  await onboardingPage.navigateToPage('jaxx');
  await onboardingPage.waitPageLoaded('jaxx');

  const title = getAllByText('Jaxx');
  await t.expect(title.exists).ok();
});
