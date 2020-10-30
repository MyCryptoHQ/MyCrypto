import { ClientFunction, t } from 'testcafe';

import { FIXTURES_CONST } from './fixtures';

export const _setupEthereumMock = ClientFunction((privateKey) => {
  window.ethereum.initialize(privateKey, 3);
});

export const setupEthereumMock = async (privateKey) => {
  await t.expect(ClientFunction(() => window.initialize)).ok({ timeout: FIXTURES_CONST.TIMEOUT });
  await _setupEthereumMock(privateKey);
};
