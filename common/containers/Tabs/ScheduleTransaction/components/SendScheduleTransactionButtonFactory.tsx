import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { walletSelectors } from 'features/wallet';
import { scheduleSelectors } from 'features/schedule';
import {
  getSerializedTransaction,
  isNetworkRequestPending,
  isValidGasPrice,
  isValidGasLimit,
  getSignedTx,
  getWeb3Tx
} from 'features/transaction';
import { SendButtonFactoryClass } from 'components/SendButtonFactory';

const mapStateToProps = (state: AppState) => {
  return {
    walletType: walletSelectors.getWalletType(state),
    serializedTransaction: getSerializedTransaction(state),
    ...scheduleSelectors.getSchedulingTransaction(state),
    networkRequestPending: isNetworkRequestPending(state),
    validGasPrice: isValidGasPrice(state),
    validGasLimit: isValidGasLimit(state),
    signedTx: !!getSignedTx(state) || !!getWeb3Tx(state)
  };
};

export const SendScheduleTransactionButtonFactory = connect(mapStateToProps)(
  SendButtonFactoryClass
);
