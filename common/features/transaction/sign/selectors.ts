import { AppState } from 'features/reducers';

import { getTransactionState } from '../selectors';

export const getSignState = (state: AppState) => getTransactionState(state).sign;
export const getSignedTx = (state: AppState) => getSignState(state).local.signedTransaction;
export const getWeb3Tx = (state: AppState) => getSignState(state).web3.transaction;
