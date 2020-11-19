import { ClientFunction, t } from 'testcafe';

import { FIXTURES_CONST } from './fixtures';
import { waitForProperty } from './helpers';

const NETWORKS = {
  5: 'https://goerli.mycryptoapi.com'
};

const _setupEthereumMock = ClientFunction((privateKey, chainId, rpcUrl) => {
  window.ethereum.initialize(privateKey, chainId, rpcUrl);
});

export const setupEthereumMock = async (privateKey, chainId) => {
  await t
    .expect(waitForProperty((w) => w.ethereum.initialize))
    .ok({ timeout: FIXTURES_CONST.TIMEOUT });
  const rpcUrl = NETWORKS[chainId];
  await _setupEthereumMock(privateKey, chainId, rpcUrl);
};
