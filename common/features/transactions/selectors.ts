import { SavedTransaction } from 'types/transactions';
import { AppState } from 'features/reducers';
import { getNetworkConfig } from 'features/config';
import { getWalletInst } from 'features/wallet';

export function getTransactionDatas(state: AppState) {
  return state.transactions.txData;
}

export function getRecentTransactions(state: AppState): SavedTransaction[] {
  return state.transactions.recent;
}

export function getRecentNetworkTransactions(state: AppState): SavedTransaction[] {
  const txs = getRecentTransactions(state);
  const network = getNetworkConfig(state);
  return txs.filter(tx => tx.chainId === network.chainId);
}

export function getRecentWalletTransactions(state: AppState): SavedTransaction[] {
  const networkTxs = getRecentNetworkTransactions(state);
  const wallet = getWalletInst(state);

  if (wallet) {
    const addr = wallet.getAddressString().toLowerCase();
    return networkTxs.filter(tx => tx.from.toLowerCase() === addr);
  } else {
    return [];
  }
}
