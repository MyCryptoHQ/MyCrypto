import { AppState } from 'reducers';

export function getTransactionDatas(state: AppState) {
  return state.transactions.txData;
}
