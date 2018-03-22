import React from 'react';
import translate from 'translations';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { SigningStatus } from 'components';
import { SendScheduleTransactionButtonFactory } from 'containers/Tabs/ScheduleTransaction/components/SendScheduleTransactionButtonFactory';

export const SendScheduleTransactionButton: React.SFC<{
  className?: string;
  signing?: boolean;
  customModal?: typeof ConfirmationModal;
}> = ({ signing, customModal, className }) => (
  <React.Fragment>
    <SendScheduleTransactionButtonFactory
      signing={signing}
      Modal={customModal ? customModal : ConfirmationModal}
      withProps={({ disabled, openModal, signTx }) => (
        <React.Fragment>
          <button
            disabled={disabled}
            className={`SendButton btn btn-primary btn-block ${className}`}
            onClick={() => {
              !!signing ? (signTx(), openModal()) : openModal();
            }}
          >
            {translate('SCHEDULE_schedule')}
          </button>
        </React.Fragment>
      )}
    />
    <SigningStatus />
  </React.Fragment>
);
