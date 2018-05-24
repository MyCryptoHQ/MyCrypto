import { connect } from 'react-redux';
import { AppState } from 'reducers';
import {
  isNetworkRequestPending,
  isValidGasPrice,
  isValidGasLimit,
  getSerializedTransaction,
  getSignedTx
} from 'selectors/transaction';
import { getWalletType } from 'selectors/wallet';
import { GenerateTransactionFactoryClass } from 'components/GenerateTransactionFactory';
import { getSchedulingTransaction } from 'selectors/schedule/transaction';

export const ScheduleTransactionFactory = connect((state: AppState) => ({
  ...getSchedulingTransaction(state),
  walletType: getWalletType(state),
  serializedTransaction: getSerializedTransaction(state),
  networkRequestPending: isNetworkRequestPending(state),
  isWeb3Wallet: getWalletType(state).isWeb3Wallet,
  validGasPrice: isValidGasPrice(state),
  validGasLimit: isValidGasLimit(state),
  signedTx: !!getSignedTx(state)
}))(GenerateTransactionFactoryClass);
