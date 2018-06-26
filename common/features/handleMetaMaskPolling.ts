import { Store } from 'redux';

import { translateRaw } from 'translations';
import { Web3Wallet } from 'libs/wallet';
import { AppState } from './reducers';
import * as configNetworksSelectors from './config/networks/selectors';
import { walletActions, walletSelectors } from './wallet';
import { notificationsActions } from './notifications';

export const METAMASK_POLLING_INTERVAL: number = 1000;

export const getActualChainId = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const { web3 } = window as any;

    if (!web3) {
      reject('Web3 not found.');
    }

    return web3.version.getNetwork(
      (err: Error, network: string) => (err ? reject(err) : resolve(network))
    );
  });

/**
 * @desc
 * MetaMask no longer refreshes the page automatically on network change,
 * so we must poll to ensure the network is the same as the locally stored version.
 * @see https://medium.com/metamask/breaking-change-no-longer-reloading-pages-on-network-change-4a3e1fd2f5e7
 */
export default async function handleMetaMaskPolling(store: Store<AppState>): Promise<boolean> {
  const state = store.getState();

  try {
    // Locally stored network.
    const web3Wallet = walletSelectors.getWalletInst(state);

    // MetaMask's actual network.
    const actualChainId = await getActualChainId();
    const actualNetwork = configNetworksSelectors.getNetworkByChainId(state, actualChainId);

    if (web3Wallet && actualNetwork && (web3Wallet as Web3Wallet).network !== actualNetwork.id) {
      store.dispatch(walletActions.resetWallet());
      store.dispatch(
        notificationsActions.showNotification(
          'danger',
          translateRaw('DETECTED_METAMASK_NETWORK_CHANGE'),
          3000
        )
      );

      return true;
    }
  } catch (error) {
    store.dispatch(walletActions.resetWallet());
    store.dispatch(
      notificationsActions.showNotification(
        'danger',
        translateRaw('METAMASK_NETWORK_VERIFY_ERROR'),
        3000
      )
    );

    return true;
  }

  return false;
}
