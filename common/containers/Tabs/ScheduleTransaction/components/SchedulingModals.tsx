import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import { scheduleSelectors, scheduleActions } from 'features/schedule';
import { getAwaitingMiningURL } from 'libs/scheduling';
import { Spinner, Modal } from 'components/ui';
import { ETHTxExplorer, ETHAddressExplorer } from 'config';
import { ConfirmationModal } from 'components/ConfirmationModal';
import EthereumJSTx from 'ethereumjs-tx';
import {
  transactionSignActions,
  transactionSignSelectors,
  transactionSelectors
} from 'features/transaction';
import * as derivedSelectors from 'features/selectors';
import { TxObj } from 'mycrypto-shepherd/dist/lib/types';
import './SchedulingModals.scss';

interface Props {
  transactionHash: string;
  scheduledTokensApproveTransaction: TxObj | undefined;
  serializedTransaction: Buffer | null;
  signaturePending: boolean;
  signedTx: boolean;
  sendingTokenApproveTransaction: boolean;
  transactionBroadcasted: boolean;
  scheduledTransactionAddress: string;

  signTransactionRequested: transactionSignActions.TSignTransactionRequested;
  setScheduledTransactionHash: scheduleActions.TSetScheduledTransactionHash;
  setSendingTokenApproveTransaction: scheduleActions.TSetSendingTokenApproveTransaction;
  setScheduledTokensApproveTransaction: scheduleActions.TSetScheduledTokensApproveTransaction;
}

interface State {
  approveTokensButtonClicked: boolean;
}

class SchedulingModalsClass extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      approveTokensButtonClicked: false
    };
  }

  public attemptSendApproveTokenTransaction() {
    const {
      scheduledTokensApproveTransaction,
      signTransactionRequested,
      setScheduledTransactionHash,
      setSendingTokenApproveTransaction
    } = this.props;

    if (!scheduledTokensApproveTransaction) {
      return;
    }

    this.setState({
      approveTokensButtonClicked: true
    });

    setSendingTokenApproveTransaction(true);

    const tx = new EthereumJSTx(scheduledTokensApproveTransaction);

    signTransactionRequested(tx);
    setScheduledTransactionHash({
      raw: '',
      value: ''
    });
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      this.state.approveTokensButtonClicked &&
      !prevProps.transactionBroadcasted &&
      this.props.transactionBroadcasted
    ) {
      this.closeAwaitingMiningModal();
    }
  }

  public closeAwaitingMiningModal() {
    this.setState({
      approveTokensButtonClicked: false
    });

    this.props.setSendingTokenApproveTransaction(false);
    this.props.setScheduledTokensApproveTransaction(undefined);
    this.props.setScheduledTransactionHash({
      raw: '',
      value: ''
    });
  }

  public render() {
    const {
      scheduledTokensApproveTransaction,
      serializedTransaction,
      transactionHash,
      signaturePending,
      signedTx,
      sendingTokenApproveTransaction,
      scheduledTransactionAddress
    } = this.props;

    let approveTokensSection;

    const awaitingMiningLink = transactionHash ? getAwaitingMiningURL(transactionHash) : '';

    if (
      scheduledTokensApproveTransaction &&
      !sendingTokenApproveTransaction &&
      !this.state.approveTokensButtonClicked
    ) {
      approveTokensSection = (
        <React.Fragment>
          {translate('SCHEDULE_TOKEN_TRANSFER_APPROVE_EXPLANATION')}
          <br />
          <br />
          <button
            className="btn btn-primary"
            onClick={() => this.attemptSendApproveTokenTransaction()}
          >
            {translate('SCHEDULE_TOKEN_TRANSFER_APPROVE_TOKENS')}
          </button>
          <br />
          <br />
          {translate('SCHEDULE_TOKEN_TRANSFER_SCHEDULED_ADDRESS_INFO')}
          <br />
          <b>{scheduledTransactionAddress}</b>
          <br />
          (view in{' '}
          <a href={awaitingMiningLink} target="_blank" rel="noopener noreferrer">
            Chronos
          </a>{' '}
          or{' '}
          <a
            href={ETHAddressExplorer(scheduledTransactionAddress)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Etherscan
          </a>
          )
        </React.Fragment>
      );
    }

    const confirmationModalShouldBeOpen =
      !signaturePending &&
      signedTx &&
      scheduledTokensApproveTransaction &&
      Boolean(serializedTransaction) &&
      sendingTokenApproveTransaction;

    return (
      <React.Fragment>
        <Modal
          title={translateRaw('AWAITING_MINING')}
          isOpen={Boolean(transactionHash)}
          // tslint:disable-next-line:no-empty
          handleClose={() => this.closeAwaitingMiningModal()}
        >
          <div className="AwaitingMiningModal-content">
            {approveTokensSection ? (
              approveTokensSection
            ) : (
              <React.Fragment>
                <Spinner size="x5" />
                <br />
                <br />
                {translate('SCHEDULE_TRANSACTION_MINING_PART_1')}
                <a href={ETHTxExplorer(transactionHash)} target="_blank" rel="noopener noreferrer">
                  {translate('SCHEDULE_TRANSACTION_MINING_PART_2')}
                </a>
                <br />
                <br />
                {translate('SCHEDULE_TOKEN_TRANSFER_MINING_PART_1')}
              </React.Fragment>
            )}
            <br />
            <br />
            {translate('SCHEDULE_TOKEN_TRANSFER_MINING_PART_2')}{' '}
            <a href={awaitingMiningLink} rel="noopener noreferrer" target="_blank">
              {awaitingMiningLink}
            </a>
          </div>
        </Modal>

        {confirmationModalShouldBeOpen && (
          <ConfirmationModal
            isOpen={confirmationModalShouldBeOpen}
            // tslint:disable-next-line:no-empty
            onClose={() => {}}
          />
        )}
      </React.Fragment>
    );
  }
}

export const SchedulingModals = connect(
  (state: AppState) => ({
    scheduledTokensApproveTransaction: scheduleSelectors.getScheduledTokensApproveTransaction(
      state
    ),
    transactionHash: scheduleSelectors.getScheduledTransactionHash(state),
    scheduledTransactionAddress: scheduleSelectors.getScheduledTransactionAddress(state),
    serializedTransaction: derivedSelectors.getSerializedTransaction(state),
    signaturePending: derivedSelectors.signaturePending(state).isSignaturePending,
    signedTx:
      !!transactionSignSelectors.getSignedTx(state) || !!transactionSignSelectors.getWeb3Tx(state),
    sendingTokenApproveTransaction: scheduleSelectors.getSendingTokenApproveTransaction(state),
    transactionBroadcasted: transactionSelectors.currentTransactionBroadcasted(state)
  }),
  {
    setScheduledTransactionHash: scheduleActions.setScheduledTransactionHash,
    signTransactionRequested: transactionSignActions.signTransactionRequested,
    setSendingTokenApproveTransaction: scheduleActions.setSendingTokenApproveTransaction,
    setScheduledTokensApproveTransaction: scheduleActions.setScheduledTokensApproveTransaction
  }
)(SchedulingModalsClass);
