import { AppState } from 'reducers';

export { getSignedTx, getWeb3Tx, getTransactionStatus };

const getSignedTx = (state: AppState) =>
  state.transaction.sign.local.signedTransaction;
const getWeb3Tx = (state: AppState) => state.transaction.sign.web3.transaction;
const getTransactionStatus = (state: AppState, indexingHash: string) =>
  state.transaction.broadcast[indexingHash];
