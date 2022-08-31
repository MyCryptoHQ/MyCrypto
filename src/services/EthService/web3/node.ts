import { Web3Provider } from '@ethersproject/providers';

import { translateRaw } from '@translations';
import {
  IExposedAccountsPermission,
  IWeb3Permission,
  TAddress,
  Web3RequestPermissionsResult
} from '@types';

export async function getChainIdAndLib() {
  const lib = new Web3Provider(
    (window as CustomWindow).ethereum || (window as CustomWindow).web3.currentProvider
  );
  const network = await lib.getNetwork();
  const chainId = network.chainId;
  return { chainId, lib };
}

export async function setupWeb3Node() {
  // Handle the following MetaMask breaking change:
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  const { ethereum } = window as CustomWindow;
  if (ethereum) {
    // Overwrite the legacy Web3 with the newer version.
    if ((window as any).Web3) {
      (window as CustomWindow).web3 = new (window as any).Web3(ethereum);
    }
    const { lib, chainId } = await getChainIdAndLib();

    const requestedPermissions = await requestPermission(lib);
    if (requestedPermissions) {
      return { lib, chainId };
    }

    const legacyConnect = await requestLegacyConnect(ethereum);
    if (legacyConnect) {
      return { lib, chainId };
    }
    throw new Error(ethereum.isMetaMask && translateRaw('METAMASK_PERMISSION_DENIED'));
  } else if ((window as any).web3) {
    // Legacy handling; will become unavailable 11/2.
    const { web3 } = window as any;

    if (!web3 || !web3.currentProvider || !web3.currentProvider.sendAsync) {
      throw new Error('Web3 not found. Please check that MetaMask is installed');
    }

    return getChainIdAndLib();
  } else {
    throw new Error('Web3 not found. Please check that MetaMask is installed');
  }
}

const requestPermission = async (web3: Web3Provider) => {
  try {
    return await requestPermissions(web3);
  } catch (e) {
    console.debug('[requestPermission]: ERROR:', e);
    return;
  }
};

const requestLegacyConnect = async (ethereum: any) => {
  try {
    await ethereum.enable();
    return true;
  } catch (e) {
    console.debug('[requestLegacyConnect]: ERROR', e);
    return;
  }
};

export const getApprovedAccounts = (web3: Web3Provider): Promise<TAddress[] | undefined> => {
  return web3
    .send('wallet_getPermissions', [])
    .then((result) => result && result[0] && result[0].caveats)
    .then((permissions: IWeb3Permission[] | undefined) => deriveApprovedAccounts(permissions));
};

export const requestPermissions = (web3: Web3Provider): Promise<Web3RequestPermissionsResult[]> => {
  return web3
    .send('wallet_requestPermissions', [
      {
        eth_accounts: {}
      }
    ])
    .then((result) => result);
};

// requestAccounts will prompt user to unlock when necessary, but will not request permissions.
export const requestAccounts = (web3: Web3Provider): Promise<Web3RequestPermissionsResult[]> => {
  return web3.send('eth_requestAccounts', []);
};

const deriveApprovedAccounts = (walletPermissions: IWeb3Permission[] | undefined) => {
  if (!walletPermissions) return;
  const exposedAccounts = walletPermissions.find(
    (caveat) => caveat.name === 'exposedAccounts' || caveat.type === 'restrictReturnedAccounts'
  ) as IExposedAccountsPermission | undefined;
  return exposedAccounts && exposedAccounts.value;
};
