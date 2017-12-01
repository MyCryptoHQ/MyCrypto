import { AppState } from 'reducers';
import { getWalletType } from 'selectors/wallet';

export {
  getSignedTx,
  getWeb3Tx,
  getTransactionStatus,
  getFrom,
  currentTransactionBroadcasting,
  currentTransactionBroadcasted,
  signaturePending
};

const getSignedTx = (state: AppState) =>
  state.transaction.sign.local.signedTransaction;
const getWeb3Tx = (state: AppState) => state.transaction.sign.web3.transaction;
const getTransactionStatus = (state: AppState, indexingHash: string) =>
  state.transaction.broadcast[indexingHash];
const getFrom = (state: AppState) => state.transaction.meta.from;

const getCurrentTransactionStatus = (state: AppState) => {
  const { indexingHash } = state.transaction.sign;
  if (!indexingHash) {
    return false;
  }
  const txExists = getTransactionStatus(state, indexingHash);
  return txExists;
};

const signaturePending = (state: AppState) => {
  const { isHardwareWallet } = getWalletType(state);
  const { pending } = state.transaction.sign;
  return { isHardwareWallet, isSignaturePending: pending };
};
// Note: if the transaction or the indexing hash doesn't exist, we have a problem
const currentTransactionBroadcasting = (state: AppState) => {
  const txExists = getCurrentTransactionStatus(state);

  return txExists && txExists.isBroadcasting;
};

const currentTransactionBroadcasted = (state: AppState) => {
  const txExists = getCurrentTransactionStatus(state);

  return txExists && !txExists.isBroadcasting;
};
