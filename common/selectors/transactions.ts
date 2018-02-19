import { AppState } from 'reducers';
import { SavedTransaction } from 'utils/localStorage';
import { getNetworkConfig } from './config';

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
