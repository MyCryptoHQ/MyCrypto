import { connect } from 'react-redux';
import { AppState } from 'redux/reducers';
import {
  isNetworkRequestPending,
  isValidGasPrice,
  isValidGasLimit,
  getSerializedTransaction,
  getSignedTx
} from 'redux/transaction';
import { getWalletType } from 'redux/wallet';
import { GenerateTransactionFactoryClass } from 'components/GenerateTransactionFactory';
import { getSchedulingTransaction } from 'redux/schedule';

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
