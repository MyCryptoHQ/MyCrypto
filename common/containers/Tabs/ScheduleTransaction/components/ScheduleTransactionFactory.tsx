import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import {
  transactionNetworkSelectors,
  transactionSignSelectors,
  transactionSelectors
} from 'features/transaction';
import { walletSelectors } from 'features/wallet';
import { GenerateTransactionFactoryClass } from 'components/GenerateTransactionFactory';

export const ScheduleTransactionFactory = connect((state: AppState) => ({
  ...derivedSelectors.getSchedulingTransaction(state),
  walletType: walletSelectors.getWalletType(state),
  serializedTransaction: derivedSelectors.getSerializedTransaction(state),
  networkRequestPending: transactionNetworkSelectors.isNetworkRequestPending(state),
  isWeb3Wallet: walletSelectors.getWalletType(state).isWeb3Wallet,
  validGasPrice: transactionSelectors.isValidGasPrice(state),
  validGasLimit: transactionSelectors.isValidGasLimit(state),
  signedTx: !!transactionSignSelectors.getSignedTx(state)
}))(GenerateTransactionFactoryClass);
