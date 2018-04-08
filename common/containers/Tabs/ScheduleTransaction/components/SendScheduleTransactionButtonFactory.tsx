import { getWalletType } from 'selectors/wallet';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import {
  getSerializedTransaction,
  isNetworkRequestPending,
  isValidGasPrice,
  isValidGasLimit,
  getSignedTx,
  getWeb3Tx
} from 'selectors/transaction';
import { SendButtonFactoryClass } from 'components/SendButtonFactory';
import { getSchedulingTransaction } from 'selectors/schedule/transaction';

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
