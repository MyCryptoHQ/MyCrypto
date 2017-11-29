import { AppState } from 'reducers';

export { getSignedTx, getWeb3Tx };
const getSignedTx = (state: AppState) =>
  state.transaction.sign.local.signedTransaction;
const getWeb3Tx = (state: AppState) => state.transaction.sign.web3.transaction;
