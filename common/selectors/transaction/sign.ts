import { getWalletType } from 'selectors/wallet';
import { AppState } from 'reducers';
import { getTransactionState } from './transaction';

const getSignState = (state: AppState) => getTransactionState(state).sign;

const signaturePending = (state: AppState) => {
  const { isHardwareWallet } = getWalletType(state);
  const { pending } = state.transaction.sign;
  return { isHardwareWallet, isSignaturePending: pending };
};

const getSignedTx = (state: AppState) => getSignState(state).local.signedTransaction;

const getWeb3Tx = (state: AppState) => getSignState(state).web3.transaction;

const getSerializedTransaction = (state: AppState) =>
  getWalletType(state).isWeb3Wallet ? getWeb3Tx(state) : getSignedTx(state);

export { signaturePending, getSignedTx, getWeb3Tx, getSignState, getSerializedTransaction };
