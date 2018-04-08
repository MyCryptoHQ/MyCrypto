import React, { Component } from 'react';
import translate from 'translations';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { SigningStatus } from 'components';
import { SendScheduleTransactionButtonFactory } from 'containers/Tabs/ScheduleTransaction/components/SendScheduleTransactionButtonFactory';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getScheduleParamsValidity } from 'selectors/schedule/fields';

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
  paramsValidity: getScheduleParamsValidity(state).value
}))(SendScheduleTransactionButtonClass);
