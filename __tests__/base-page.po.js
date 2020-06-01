import { t, ClientFunction } from 'testcafe';
import { FIXTURES_CONST } from './fixtures';

export default class BasePage {
  getCurrentLocation = ClientFunction(() => window.location.href);

  async waitForPage(url) {
    await t.expect(this.getCurrentLocation()).eql(url,
      { timeout: FIXTURES_CONST.TIMEOUT });
  }
}
