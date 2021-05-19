import { getByText } from '@testing-library/testcafe';

import DashboardPage from './dashboard-page.po';
import { PAGES } from './fixtures';
import { findByTKey } from './translation-utils';

const dashboardPage = new DashboardPage();

fixture('Demo Mode').page(PAGES.ADD_ACCOUNT);

test('Can prompt to use demo mode', async (t) => {
  const button = getByText(findByTKey('DEMO_BUTTON_TEXT'));
  await t.expect(button.exists).ok();
});

test('Can redirect to dashboard when activated', async (t) => {
  await t.click(getByText(findByTKey('DEMO_BUTTON_TEXT')));
  await dashboardPage.waitPageLoaded();
  await dashboardPage.expectAccountTableToMatchCount(4);
});
