import { Web3Provider } from '@ethersproject/providers';

import { getApprovedAccounts, setupWeb3Node } from '@services/EthService';
import { getNetworkByChainId } from '@services/Store';
import { Network } from '@types';

import { Web3Wallet } from '../non-deterministic';

export const unlockWeb3 = async (networks: Network[]) => {
  const { lib: nodeLib, chainId } = await setupWeb3Node();
  const network: Network | undefined = getNetworkByChainId(chainId, networks);

  if (!network) {
    throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
  }

  try {
    // try to get modern web3 permissions using wallet_getPermissions
    const accounts = await getApprovedAccounts(nodeLib);
    if (accounts) {
      return accounts.map((address) => new Web3Wallet(address, network.id));
    } else {
      // Coinbase Wallet returns undefined when using wallet_getPermissions, it doesn't fail. Therefore fail if accounts == undefined
      throw new Error('Failed to get web3 accounts via wallet_getPermissions');
    }
  } catch {
    // if modern wallet_getPermissions doesn't exist,
    try {
      const legacyAccounts = await getLegacyAccounts(nodeLib);
      if (legacyAccounts) {
        return legacyAccounts.map((address) => new Web3Wallet(address, network.id));
      }
      throw new Error('Could not get accounts');
    } catch {
      throw new Error('Error fetching legacy web3 accounts');
    }
  }
};

const getLegacyAccounts = async (nodeLib: Web3Provider) => await nodeLib.listAccounts();
