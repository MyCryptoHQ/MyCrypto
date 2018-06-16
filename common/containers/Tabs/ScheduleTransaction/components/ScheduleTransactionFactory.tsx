import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import {
  isNetworkRequestPending,
  isValidGasPrice,
  isValidGasLimit,
  getSignedTx
} from 'features/transaction';
import { walletSelectors } from 'features/wallet';
import { GenerateTransactionFactoryClass } from 'components/GenerateTransactionFactory';

export const ScheduleTransactionFactory = connect((state: AppState) => ({
  ...selectors.getSchedulingTransaction(state),
  walletType: walletSelectors.getWalletType(state),
  serializedTransaction: selectors.getSerializedTransaction(state),
  networkRequestPending: isNetworkRequestPending(state),
  isWeb3Wallet: walletSelectors.getWalletType(state).isWeb3Wallet,
  validGasPrice: isValidGasPrice(state),
  validGasLimit: isValidGasLimit(state),
  signedTx: !!getSignedTx(state)
}))(GenerateTransactionFactoryClass);
