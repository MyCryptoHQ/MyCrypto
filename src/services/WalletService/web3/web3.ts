import { translateRaw } from '@translations';

import { isWeb3Node, setupWeb3Node } from '@services/EthService';
import { Network } from '@types';
import { getNetworkByChainId } from '@services/Store';
import { Web3Wallet } from '../non-deterministic';

export const unlockWeb3 = (onSuccess: (data: any) => void) => async (networks: Network[]) => {
  try {
    const { lib: nodeLib, chainId } = await setupWeb3Node();
    const network: Network | undefined = getNetworkByChainId(parseInt(chainId, 10), networks);

    if (!network) {
      throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
    }

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Cannot use Web3 wallet without a Web3 node.');
    }

    const accounts = await nodeLib.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in MetaMask / Web3.');
    }

    onSuccess(network);
    return accounts.map((address) => new Web3Wallet(address, network.id));
  } catch (err) {
    // unset web3 node so node dropdown isn't disabled
    console.error('Error ' + translateRaw(err.message));
  }
};
