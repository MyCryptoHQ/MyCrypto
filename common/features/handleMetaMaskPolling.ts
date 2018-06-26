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

export default async function handleMetaMaskPolling(store: Store<AppState>) {
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
  }
}
