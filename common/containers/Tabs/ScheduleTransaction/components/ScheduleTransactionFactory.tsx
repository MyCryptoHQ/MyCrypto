import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import {
  isNetworkRequestPending,
  isValidGasPrice,
  isValidGasLimit,
  getSerializedTransaction,
  getSignedTx
} from 'features/transaction/selectors';
import { getWalletType } from 'features/wallet/selectors';
import { getSchedulingTransaction } from 'features/schedule/selectors';
import { GenerateTransactionFactoryClass } from 'components/GenerateTransactionFactory';

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
