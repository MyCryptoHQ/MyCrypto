import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { AppState } from 'features/reducers';
import { scheduleSelectors } from 'features/schedule';
import { SendScheduleTransactionButtonFactory } from 'containers/Tabs/ScheduleTransaction/components/SendScheduleTransactionButtonFactory';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { SigningStatus, AwaitingMiningModal } from 'components';
import { getTXDetailsCheckURL } from 'libs/scheduling';

interface Props {
  className?: string;
  signing?: boolean;
  customModal?: typeof ConfirmationModal;
  paramsValidity: boolean;
  transactionHash: string;
}

class SendScheduleTransactionButtonClass extends Component<Props> {
  public render() {
    const { className, customModal, paramsValidity, signing, transactionHash } = this.props;

    const awaitingMiningLink = transactionHash ? getTXDetailsCheckURL(transactionHash) : '';

    return (
      <React.Fragment>
        <SendScheduleTransactionButtonFactory
          signing={signing}
          Modal={customModal ? customModal : ConfirmationModal}
          withProps={({ disabled, openModal, signTx }) => (
            <React.Fragment>
              <button
                disabled={disabled || !paramsValidity}
                className={`SendButton btn btn-primary btn-block ${className}`}
                onClick={() => {
                  !!signing ? (signTx(), openModal()) : openModal();
                }}
              >
                {translate('SCHEDULE_SCHEDULE')}
              </button>
            </React.Fragment>
          )}
        />
        <SigningStatus />
        <AwaitingMiningModal
          isOpen={Boolean(transactionHash)}
          transactionHash={transactionHash}
          message={
            <span>
              {translate('SCHEDULE_TOKEN_TRANSFER_MINING_PART_1')}
              <br />
              <br />
              {translate('SCHEDULE_TOKEN_TRANSFER_MINING_PART_2')}{' '}
              <a href={awaitingMiningLink} rel="noopener noreferrer" target="_blank">
                {awaitingMiningLink}
              </a>
            </span>
          }
        />
      </React.Fragment>
    );
  }
}

export const SendScheduleTransactionButton = connect((state: AppState) => ({
  paramsValidity: scheduleSelectors.getScheduleParamsValidity(state).value,
  transactionHash: scheduleSelectors.getScheduledTransactionHash(state)
}))(SendScheduleTransactionButtonClass);
