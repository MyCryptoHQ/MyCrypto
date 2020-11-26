import { getByText } from '@testing-library/testcafe';
import { ClientFunction, Role } from 'testcafe';

import { setupEthereumMock } from './ethereum-mock';
import { ENV, FIXTURES_CONST, PAGES } from './fixtures';
import { getTransValueByKey } from './translation-utils';

const getCurrentLocation = ClientFunction(() => window.location.href);

export const web3Account = Role(
  PAGES.ADD_ACCOUNT_WEB3,
  async (t) => {
    await setupEthereumMock(ENV.E2E_PRIVATE_KEY, 5);
    await t
      .click(getByText(getTransValueByKey('ADD_WEB3_DEFAULT')))
      .expect(getCurrentLocation())
      .eql(PAGES.DASHBOARD, { timeout: FIXTURES_CONST.TIMEOUT });
  },
  { preserveUrl: true }
);
