import React, { Component } from 'react';
import { getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import {
  getCurrentTransactionStatus,
  currentTransactionBroadcasted,
  signaturePending,
  getSignedTx,
  getWeb3Tx
} from 'selectors/transaction';
import { showNotification, TShowNotification } from 'actions/notifications';
import { ITransactionStatus } from 'reducers/transaction/broadcast';
import { TSignTransactionRequested, signTransactionRequested } from 'actions/transaction';
import { ConfirmationModal } from 'components/ConfirmationModal';

interface StateProps {
  offline: boolean;
  currentTransaction: false | ITransactionStatus | null;
  transactionBroadcasted: boolean;
  signaturePending: boolean;
  signedTx: boolean;
}

interface State {
  showModal: boolean;
}

interface DispatchProps {
  showNotification: TShowNotification;

  signTransactionRequested: TSignTransactionRequested;
}

interface OwnProps {
  Modal: typeof ConfirmationModal;
  withOnClick(onClick: {
    openModal(): void;
    signer(signer: any): void;
  }): React.ReactElement<any> | null;
}

const INITIAL_STATE: State = {
  showModal: false
};

type Props = OwnProps & StateProps & DispatchProps;

class OnlineSendClass extends Component<Props, State> {
  public state: State = INITIAL_STATE;

  public render() {
    return (
      <React.Fragment>
        {this.props.withOnClick({
          openModal: this.openModal,
          signer: this.props.signTransactionRequested
        })}
        <this.props.Modal
          isOpen={!this.props.signaturePending && this.props.signedTx && this.state.showModal}
          onClose={this.closeModal}
        />
      </React.Fragment>
    );
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.transactionBroadcasted && this.state.showModal) {
      this.closeModal();
    }
  }
  private openModal = () => {
    const { currentTransaction } = this.props;

    if (
      currentTransaction &&
      (currentTransaction.broadcastSuccessful || currentTransaction.isBroadcasting)
    ) {
      return this.props.showNotification(
        'warning',
        'The current transaction is already broadcasting or has been successfully broadcasted'
      );
    }
    this.setState({ showModal: true });
  };

  private closeModal = () => this.setState({ showModal: false });
}

export const OnlineSend = connect(
  (state: AppState) => ({
    offline: getOffline(state),
    currentTransaction: getCurrentTransactionStatus(state),
    transactionBroadcasted: currentTransactionBroadcasted(state),
    signaturePending: signaturePending(state).isSignaturePending,
    signedTx: !!getSignedTx(state) || !!getWeb3Tx(state)
  }),
  { showNotification, signTransactionRequested }
)(OnlineSendClass);
