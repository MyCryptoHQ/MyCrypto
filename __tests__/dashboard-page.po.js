import { t, Selector } from 'testcafe';

import { PAGES, FIXTURE_ETHEREUM, FIXTURE_VIEW_ONLY_ADDRESS } from './fixtures';
import BasePage from './base-page.po';
import { getTransValueByKey } from './translation-utils';
import { getByText } from '@testing-library/testcafe';

export default class DashboardPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.DASHBOARD);
  }

  async waitPageLoaded() {
    await this.waitForPage(PAGES.DASHBOARD);
  }

  async expectAccountTableToMatchCount(count) {
    await t.expect(Selector('section:first-of-type > div > table tbody tr').count).eql(count);
  }
}
