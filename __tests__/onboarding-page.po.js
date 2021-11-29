import BasePage from './base-page.po';
import { PAGES } from './fixtures';

export default class OnboardingPage extends BasePage {
  async navigateToPage(wallet) {
    this.navigateTo(`${PAGES.ONBOARDING}/${wallet}`);
  }

  async waitPageLoaded(wallet, timeToWait) {
    await this.waitForPage(`${PAGES.ONBOARDING}/${wallet}`, timeToWait);
  }
}
