import React from 'react';
import { SendButtonFactory } from './SendButtonFactory';
import translate from 'translations';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { SigningStatus } from 'components';
import './SendButton.scss';

export const SendButton: React.SFC<{
  className?: string;
  signing?: boolean;
  customModal?: typeof ConfirmationModal;
}> = ({ signing, customModal, className }) => (
  <React.Fragment>
    <SendButtonFactory
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
            {translate('SEND_TRANS')}
          </button>
        </React.Fragment>
      )}
    />
    <SigningStatus />
  </React.Fragment>
);
