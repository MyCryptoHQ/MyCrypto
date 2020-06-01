import { getByText } from '@testing-library/testcafe';
import { PAGES } from './fixtures';
import NoAccountsPage from './no-accounts-page.po';
import Translations from './translations.po';

const noAccountsPage = new NoAccountsPage();
const translations = new Translations();

fixture('Dashboard').page(PAGES.DASHBOARD);

test('Should redirect to no-accounts', async (t) => {
  await noAccountsPage.waitPageLoaded();

  const title = getByText(translations.getLanguageValueByKey('NO_ACCOUNTS_HEADER'));
  await t.expect(title).ok();
});
