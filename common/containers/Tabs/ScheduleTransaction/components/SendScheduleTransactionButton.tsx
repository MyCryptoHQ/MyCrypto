import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { AppState } from 'features/reducers';
import { scheduleSelectors } from 'features/schedule';
import { SendScheduleTransactionButtonFactory } from 'containers/Tabs/ScheduleTransaction/components/SendScheduleTransactionButtonFactory';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { SigningStatus } from 'components';

interface Props {
  className?: string;
  signing?: boolean;
  customModal?: typeof ConfirmationModal;
  paramsValidity: boolean;
}

class SendScheduleTransactionButtonClass extends Component<Props> {
  public render() {
    const { className, customModal, paramsValidity, signing } = this.props;

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
      </React.Fragment>
    );
  }
}

export const SendScheduleTransactionButton = connect((state: AppState) => ({
  paramsValidity: scheduleSelectors.getScheduleParamsValidity(state).value
}))(SendScheduleTransactionButtonClass);
