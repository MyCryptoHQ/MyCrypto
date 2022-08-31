import { ClientFunction, t } from 'testcafe';

import { FIXTURES_CONST } from './fixtures';

export default class BasePage {
  getCurrentLocation = ClientFunction(() => window.location.href);

  async navigateTo(url) {
    await t.navigateTo(url);
  }

  async waitForPage(url, timeout) {
    await t
      .expect(this.getCurrentLocation())
      .eql(url, { timeout: timeout || FIXTURES_CONST.TIMEOUT });
  }
}
