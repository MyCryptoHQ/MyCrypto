import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import { walletSelectors } from 'features/wallet';
import {
  transactionNetworkSelectors,
  transactionSignSelectors,
  transactionSelectors
} from 'features/transaction';
import { SendButtonFactoryClass } from 'components/SendButtonFactory';

const mapStateToProps = (state: AppState) => {
  return {
    walletType: walletSelectors.getWalletType(state),
    serializedTransaction: derivedSelectors.getSerializedTransaction(state),
    ...derivedSelectors.getSchedulingTransaction(state),
    networkRequestPending: transactionNetworkSelectors.isNetworkRequestPending(state),
    validGasPrice: transactionSelectors.isValidGasPrice(state),
    validGasLimit: transactionSelectors.isValidGasLimit(state),
    signedTx:
      !!transactionSignSelectors.getSignedTx(state) || !!transactionSignSelectors.getWeb3Tx(state)
  };
};

export const SendScheduleTransactionButtonFactory = connect(mapStateToProps)(
  SendButtonFactoryClass
);
