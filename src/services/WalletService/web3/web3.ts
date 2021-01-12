import { isWeb3Node, setupWeb3Node, Web3Node } from '@services/EthService';
import { getNetworkByChainId } from '@services/Store';
import { Network } from '@types';

import { Web3Wallet } from '../non-deterministic';

export const unlockWeb3 = async (networks: Network[]) => {
  console.debug('[unlockWeb3]: setting up web3 node.');
  const { lib: nodeLib, chainId } = await setupWeb3Node();
  console.debug(`[unlockWeb3]: determining network from chainId: ${chainId}.`);
  const network: Network | undefined = getNetworkByChainId(parseInt(chainId, 10), networks);

  if (!network) {
    console.debug(`[unlockWeb3]: network not found for chainId: ${chainId}.`);
    throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
  }
  console.debug(`[unlockWeb3]: found network for chainId: ${chainId}.`);
  if (!isWeb3Node(nodeLib)) {
    throw new Error('Cannot use Web3 wallet without a Web3 node.');
  }
  console.debug(`[unlockWeb3]: found network for chainId: ${chainId}.`);
  try {
    // try to get modern web3 permissions using wallet_getPermissions
    console.debug(`[unlockWeb3]: trying to get accounts from permissions using modern connect`);
    const accounts = await getAccounts(nodeLib);
    if (accounts) {
      console.debug(`[unlockWeb3]: modern accounts found: ${accounts}`);
      return accounts.map((address) => new Web3Wallet(address, network.id));
    } else {
      // Coinbase Wallet returns undefined when using wallet_getPermissions, it doesn't fail. Therefore fail if accounts == undefined
      throw new Error('Failed to get web3 accounts via wallet_getPermissions');
    }
  } catch (e) {
    // if modern wallet_getPermissions doesn't exist,
    console.debug(
      '[unlockWeb3]: Error fetching modern web3 permissions (wallet_getPermissions).',
      e
    );
    try {
      console.debug('[unlockWeb3]: Falling back to getLegacyAccounts.');
      const legacyAccounts = await getLegacyAccounts(nodeLib);
      if (legacyAccounts) {
        console.debug(`[unlockWeb3]: legacyAccounts found: ${legacyAccounts}`);
        return legacyAccounts.map((address) => new Web3Wallet(address, network.id));
      }
      throw new Error('Could not get accounts');
    } catch (e) {
      console.debug(`[unlockWeb3]: error logging in. Error: ${e}`);
      throw new Error('Error fetching legacy web3 accounts');
    }
  }
};

const getAccounts = async (nodeLib: Web3Node) => await nodeLib.getApprovedAccounts();

const getLegacyAccounts = async (nodeLib: Web3Node) => await nodeLib.getAccounts();
