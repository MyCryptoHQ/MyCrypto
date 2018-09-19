import React, { Component } from 'react';
import { connect } from 'react-redux';
import EthTx from 'ethereumjs-tx';

import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import { walletSelectors } from 'features/wallet';
import { Balance } from 'libs/wallet';
import {
  transactionNetworkSelectors,
  transactionSignSelectors,
  transactionSelectors
} from 'features/transaction';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { OnlineSend } from './OnlineSend';

export interface CallbackProps {
  disabled: boolean;
  signTx(): void;
  openModal(): void;
}

interface StateProps {
  walletType: walletSelectors.IWalletType;
  serializedTransaction: AppState['transaction']['sign']['local']['signedTransaction'];
  transaction: EthTx;
  isFullTransaction: boolean;
  networkRequestPending: boolean;
  validGasPrice: boolean;
  validGasLimit: boolean;
  signedTx: boolean;
}

interface OwnProps {
  balance: Balance;
  onlyTransactionParameters?: boolean;
  signing?: boolean;
  Modal: typeof ConfirmationModal;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = StateProps & OwnProps;

export class SendButtonFactoryClass extends Component<Props> {
  public render() {
    const {
      signing,
      signedTx,
      transaction,
      isFullTransaction,
      serializedTransaction,
      networkRequestPending,
      validGasPrice,
      validGasLimit,
      balance
    } = this.props;

    // return signing ? true : signedTx ? true : false
    return (
      (signing || (!signing && signedTx)) && (
        <OnlineSend
          withOnClick={({ openModal, signer }) =>
            this.props.withProps({
              disabled: signing
                ? !isFullTransaction ||
                  networkRequestPending ||
                  !validGasPrice ||
                  !validGasLimit ||
                  balance.isPending
                : !!(signing && !serializedTransaction),
              signTx: () => signer(transaction),
              openModal
            })
          }
          Modal={this.props.Modal}
        />
      )
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    balance: state.wallet.balance,
    walletType: walletSelectors.getWalletType(state),
    serializedTransaction: derivedSelectors.getSerializedTransaction(state),
    ...derivedSelectors.getTransaction(state),
    networkRequestPending: transactionNetworkSelectors.isNetworkRequestPending(state),
    validGasPrice: transactionSelectors.isValidGasPrice(state),
    validGasLimit: transactionSelectors.isValidGasLimit(state),
    signedTx:
      !!transactionSignSelectors.getSignedTx(state) || !!transactionSignSelectors.getWeb3Tx(state)
  };
};

export const SendButtonFactory = connect(mapStateToProps)(SendButtonFactoryClass);
