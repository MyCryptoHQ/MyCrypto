import { ClientFunction, t } from 'testcafe';

import { FIXTURES_CONST } from './fixtures';

const NETWORKS = {
  5: 'https://goerli.mycryptoapi.com'
};

export const _setupEthereumMock = ClientFunction((privateKey, chainId, rpcUrl) => {
  window.ethereum.initialize(privateKey, chainId, rpcUrl);
});

export const setupEthereumMock = async (privateKey, chainId) => {
  await t
    // Make sure to call the client function in order to assert against its return value:
    // e.g "You passed a ClientFunction object to 't.expect()'.
    // If you want to check the function's return value, use parentheses to call the function: fnName()."
    .expect(ClientFunction(() => window.ethereum)())
    .ok({ timeout: FIXTURES_CONST.TIMEOUT });
  const rpcUrl = NETWORKS[chainId];
  await _setupEthereumMock(privateKey, chainId, rpcUrl);
};
