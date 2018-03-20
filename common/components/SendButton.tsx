import React from 'react';
import { SendButtonFactory } from './SendButtonFactory';
import translate from 'translations';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { SigningStatus } from 'components';
import './SendButton.scss';

export const SendButton: React.SFC<{
  className?: string;
  toggleDisabled?: boolean;
  customModal?: typeof ConfirmationModal;
}> = ({ toggleDisabled, customModal, className }) => (
  <React.Fragment>
    <SendButtonFactory
      toggleDisabled={toggleDisabled}
      Modal={customModal ? customModal : ConfirmationModal}
      withProps={({ disabled, openModal, signTx }) => (
        <React.Fragment>
          <button
            disabled={disabled}
            className={`SendButton btn btn-primary btn-block ${className}`}
            onClick={() => {
              signTx();
              openModal();
            }}
          >
            {translate('SEND_trans')}
          </button>
        </React.Fragment>
      )}
    />
    <SigningStatus />
  </React.Fragment>
);
