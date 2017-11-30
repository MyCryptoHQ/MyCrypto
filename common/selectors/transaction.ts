import { AppState } from 'reducers';

export {
  getSignedTx,
  getWeb3Tx,
  getTransactionStatus,
  getFrom,
  currentTransactionBroadcasting
};

const getSignedTx = (state: AppState) =>
  state.transaction.sign.local.signedTransaction;
const getWeb3Tx = (state: AppState) => state.transaction.sign.web3.transaction;
const getTransactionStatus = (state: AppState, indexingHash: string) =>
  state.transaction.broadcast[indexingHash];
const getFrom = (state: AppState) => state.transaction.meta.from;

// Note: if the transaction or the indexing hash doesn't exist, we have a problem
const currentTransactionBroadcasting = (state: AppState) => {
  const { indexingHash } = state.transaction.sign;
  if (!indexingHash) {
    return false;
  }
  const txExists = getTransactionStatus(state, indexingHash);

  return txExists && txExists.isBroadcasting;
};
