import EthTx from 'ethereumjs-tx';
import { OnlineSend } from './OnlineSend';
import { getWalletType, IWalletType } from 'selectors/wallet';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { ConfirmationModal } from 'components/ConfirmationModal';
import {
  getSerializedTransaction,
  getTransaction,
  isNetworkRequestPending,
  isValidGasPrice,
  isValidGasLimit
} from 'selectors/transaction';

export interface CallbackProps {
  disabled: boolean;
  signTx(): void;
  openModal(): void;
}

interface StateProps {
  walletType: IWalletType;
  serializedTransaction: AppState['transaction']['sign']['local']['signedTransaction'];
  transaction: EthTx;
  isFullTransaction: boolean;
  networkRequestPending: boolean;
  validGasPrice: boolean;
  validGasLimit: boolean;
}

interface OwnProps {
  onlyTransactionParameters?: boolean;
  signedTx?: boolean;
  Modal: typeof ConfirmationModal;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = StateProps & OwnProps;

class SendButtonFactoryClass extends Component<Props> {
  public render() {
    const {
      signedTx,
      transaction,
      isFullTransaction,
      serializedTransaction,
      networkRequestPending,
      validGasPrice,
      validGasLimit
    } = this.props;

    return (
      <OnlineSend
        withOnClick={({ openModal, signer }) =>
          this.props.withProps({
            disabled: signedTx
              ? !!(signedTx && !serializedTransaction)
              : !isFullTransaction || networkRequestPending || !validGasPrice || !validGasLimit,
            signTx: () => signer(transaction),
            openModal
          })
        }
        Modal={this.props.Modal}
      />
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    walletType: getWalletType(state),
    serializedTransaction: getSerializedTransaction(state),
    ...getTransaction(state),
    networkRequestPending: isNetworkRequestPending(state),
    validGasPrice: isValidGasPrice(state),
    validGasLimit: isValidGasLimit(state)
  };
};

export const SendButtonFactory = connect(mapStateToProps)(SendButtonFactoryClass);
