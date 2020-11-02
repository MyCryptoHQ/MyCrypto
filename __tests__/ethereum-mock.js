import { ClientFunction, t } from 'testcafe';

import { FIXTURES_CONST } from './fixtures';

const NETWORKS = {
  5: 'https://goerli.mycryptoapi.com'
};

export const _setupEthereumMock = ClientFunction((privateKey, chainId, rpcUrl) => {
  window.ethereum.initialize(privateKey, chainId, rpcUrl);
});

export const setupEthereumMock = async (privateKey, chainId) => {
  await t.expect(ClientFunction(() => window.initialize)).ok({ timeout: FIXTURES_CONST.TIMEOUT });
  const rpcUrl = NETWORKS[chainId];
  await _setupEthereumMock(privateKey, chainId, rpcUrl);
};
