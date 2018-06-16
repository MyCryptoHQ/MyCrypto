import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import {
  isNetworkRequestPending,
  isValidGasPrice,
  isValidGasLimit,
  getSerializedTransaction,
  getSignedTx
} from 'features/transaction';
import { walletSelectors } from 'features/wallet';
import { scheduleSelectors } from 'features/schedule';
import { GenerateTransactionFactoryClass } from 'components/GenerateTransactionFactory';

export const ScheduleTransactionFactory = connect((state: AppState) => ({
  ...scheduleSelectors.getSchedulingTransaction(state),
  walletType: walletSelectors.getWalletType(state),
  serializedTransaction: getSerializedTransaction(state),
  networkRequestPending: isNetworkRequestPending(state),
  isWeb3Wallet: walletSelectors.getWalletType(state).isWeb3Wallet,
  validGasPrice: isValidGasPrice(state),
  validGasLimit: isValidGasLimit(state),
  signedTx: !!getSignedTx(state)
}))(GenerateTransactionFactoryClass);
