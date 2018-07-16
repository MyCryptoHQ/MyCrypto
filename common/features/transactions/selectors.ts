import { SavedTransaction } from 'types/transactions';
import { AppState } from 'features/reducers';

export function getTransactionDatas(state: AppState) {
  return state.transactions.txData;
}

export function getRecentTransactions(state: AppState): SavedTransaction[] {
  return state.transactions.recent;
}
