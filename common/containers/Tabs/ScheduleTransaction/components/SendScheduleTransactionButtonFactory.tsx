import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { getWalletType } from 'features/wallet/selectors';
import { getSchedulingTransaction } from 'features/schedule/selectors';
import {
  getSerializedTransaction,
  isNetworkRequestPending,
  isValidGasPrice,
  isValidGasLimit,
  getSignedTx,
  getWeb3Tx
} from 'features/transaction/selectors';
import { SendButtonFactoryClass } from 'components/SendButtonFactory';

const mapStateToProps = (state: AppState) => {
  return {
    walletType: getWalletType(state),
    serializedTransaction: getSerializedTransaction(state),
    ...getSchedulingTransaction(state),
    networkRequestPending: isNetworkRequestPending(state),
    validGasPrice: isValidGasPrice(state),
    validGasLimit: isValidGasLimit(state),
    signedTx: !!getSignedTx(state) || !!getWeb3Tx(state)
  };
};

export const SendScheduleTransactionButtonFactory = connect(mapStateToProps)(
  SendButtonFactoryClass
);
