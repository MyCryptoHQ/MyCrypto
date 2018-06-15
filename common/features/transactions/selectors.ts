import { SavedTransaction } from 'types/transactions';
import { AppState } from 'features/reducers';
import * as configSelectors from 'features/config/selectors';
import * as walletSelectors from 'features/wallet/selectors';

export function getTransactionDatas(state: AppState) {
  return state.transactions.txData;
}

export function getRecentTransactions(state: AppState): SavedTransaction[] {
  return state.transactions.recent;
}

export function getRecentNetworkTransactions(state: AppState): SavedTransaction[] {
  const txs = getRecentTransactions(state);
  const network = configSelectors.getNetworkConfig(state);
  return txs.filter(tx => tx.chainId === network.chainId);
}

export function getRecentWalletTransactions(state: AppState): SavedTransaction[] {
  const networkTxs = getRecentNetworkTransactions(state);
  const wallet = walletSelectors.getWalletInst(state);

  if (wallet) {
    const addr = wallet.getAddressString().toLowerCase();
    return networkTxs.filter(tx => tx.from.toLowerCase() === addr);
  } else {
    return [];
  }
}
