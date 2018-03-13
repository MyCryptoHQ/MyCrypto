import { WithSigner } from './Container';
import EthTx from 'ethereumjs-tx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import {
  getSchedulingTransaction,
  isNetworkRequestPending,
  isValidGasPrice,
  isValidGasLimit,
  getGasPrice,
  getCurrentTo,
  getCurrentValue
} from 'selectors/transaction';
import { getWalletType } from 'selectors/wallet';
import { getWindowStart } from '../../selectors/transaction/fields';

export interface CallbackProps {
  disabled: boolean;
  isWeb3Wallet: boolean;
  onClick(): void;
}

interface StateProps {
  transaction: EthTx;
  networkRequestPending: boolean;
  isFullTransaction: boolean;
  isWeb3Wallet: boolean;
  validGasPrice: boolean;
  validGasLimit: boolean;
  isWindowStartValid: boolean;
  windowStart: any;
  gasPrice: any;
  currentTo: any;
  currentValue: any;
}

interface OwnProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = OwnProps & StateProps;

class ScheduleTransactionFactoryClass extends Component<Props> {
  public render() {
    const {
      isFullTransaction,
      isWeb3Wallet,
      networkRequestPending,
      validGasPrice,
      validGasLimit,
      isWindowStartValid,
      transaction
    } = this.props;

    const isButtonDisabled =
      !isWindowStartValid ||
      !isFullTransaction ||
      networkRequestPending ||
      !validGasPrice ||
      !validGasLimit;

    return (
      <WithSigner
        isWeb3={isWeb3Wallet}
        withSigner={signer =>
          this.props.withProps({
            disabled: isButtonDisabled,
            isWeb3Wallet,
            onClick: () => signer(transaction)
          })
        }
      />
    );
  }
}

export const ScheduleTransactionFactory = connect((state: AppState) => ({
  ...getSchedulingTransaction(state),
  networkRequestPending: isNetworkRequestPending(state),
  isWeb3Wallet: getWalletType(state).isWeb3Wallet,
  validGasPrice: isValidGasPrice(state),
  validGasLimit: isValidGasLimit(state),
  windowStart: getWindowStart(state),
  gasPrice: getGasPrice(state),
  currentTo: getCurrentTo(state),
  currentValue: getCurrentValue(state)
}))(ScheduleTransactionFactoryClass);
