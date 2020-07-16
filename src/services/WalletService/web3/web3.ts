import { isWeb3Node, setupWeb3Node, Web3Node } from '@services/EthService';
import { Network } from '@types';
import { getNetworkByChainId } from '@services/Store';
import { Web3Wallet } from '../non-deterministic';

export const unlockWeb3 = (onSuccess: (data: any) => void) => async (networks: Network[]) => {
  const { lib: nodeLib, chainId } = await setupWeb3Node();
  const network: Network | undefined = getNetworkByChainId(parseInt(chainId, 10), networks);

  if (!network) {
    throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
  }

  if (!isWeb3Node(nodeLib)) {
    throw new Error('Cannot use Web3 wallet without a Web3 node.');
  }

  const accounts = await getAccounts(nodeLib);
  if (accounts) {
    onSuccess(network);
    return accounts.map((address) => new Web3Wallet(address, network.id));
  }

  const legacyAccounts = await getLegacyAccount(nodeLib);
  if (legacyAccounts) {
    onSuccess(network);
    return legacyAccounts.map((address) => new Web3Wallet(address, network.id));
  }
  throw new Error('Could not get accounts');
};

const getAccounts = async (nodeLib: Web3Node) => {
  try {
    const walletPermissions = await nodeLib.getAccountPermissions();
    const caveats = walletPermissions && walletPermissions[0] && walletPermissions[0].caveats;
    if (!caveats) return;
    const exposedAccounts = caveats.find((caveat: any) => caveat.name === 'exposedAccounts');
    const accounts: string[] = exposedAccounts.value;
    if (!accounts || accounts.length === 0) return;
    return accounts;
  } catch (e) {
    return;
  }
};

const getLegacyAccount = async (nodeLib: Web3Node) => {
  try {
    const accounts = await nodeLib.getAccounts();
    if (!accounts || accounts.length === 0) return;
    return accounts;
  } catch (e) {
    return;
  }
};
