import { translateRaw } from '@translations';

import { isWeb3Node, setupWeb3Node } from '@services/EthService';
import { Network } from '@types';
import { getNetworkByChainId } from '@services/Store';
import { Web3Wallet } from '../non-deterministic';

export const unlockWeb3 = (onSuccess: (data: any) => void) => async (networks: Network[]) => {
  try {
    console.debug('[unlockWeb3]: 1');
    const { lib: nodeLib, chainId } = await setupWeb3Node();
    console.debug('[unlockWeb3]: 2 ', chainId, nodeLib);
    const network: Network | undefined = getNetworkByChainId(parseInt(chainId, 10), networks);
    console.debug('[unlockWeb3]: 3 ', network);
    if (!network) {
      console.debug('[unlockWeb3]: 4 err', network);
      throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
    }

    if (!isWeb3Node(nodeLib)) {
      console.debug('[unlockWeb3]: 5 err');
      throw new Error('Cannot use Web3 wallet without a Web3 node.');
    }
    console.debug('[unlockWeb3]: 4');
    const walletPermissions = await nodeLib.getAccountPermissions();
    console.debug('[unlockWeb3]: 7', walletPermissions);
    console.debug('walletPermissions: ', walletPermissions);
    let accounts: string[];
    const caveats = walletPermissions && walletPermissions[0] && walletPermissions[0].caveats;
    console.debug('caveats: ', caveats);
    if (caveats) {
      const exposedAccounts = caveats.find((caveat: any) => caveat.name === 'exposedAccounts');
      accounts = exposedAccounts.value;
      console.debug('1', accounts);
    } else {
      accounts = await nodeLib.getAccounts();
      console.debug('2', accounts);
    }
    console.debug('accounts here', accounts);
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
