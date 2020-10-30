import { ClientFunction, t } from 'testcafe';

import { FIXTURES_CONST } from './fixtures';

export const _setupEthereumMock = ClientFunction((privateKey, chainId) => {
  window.ethereum.initialize(privateKey, chainId);
});

export const setupEthereumMock = async (privateKey, chainId) => {
  await t.expect(ClientFunction(() => window.initialize)).ok({ timeout: FIXTURES_CONST.TIMEOUT });
  await _setupEthereumMock(privateKey, chainId);
};
