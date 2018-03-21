import React from 'react';
import { SendButtonFactory } from './SendButtonFactory';
import translate from 'translations';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { SigningStatus } from 'components';
import './SendButton.scss';

export const SendButton: React.SFC<{
  className?: string;
  signedTx?: boolean;
  customModal?: typeof ConfirmationModal;
}> = ({ signedTx, customModal, className }) => (
  <React.Fragment>
    <SendButtonFactory
      signedTx={signedTx}
      Modal={customModal ? customModal : ConfirmationModal}
      withProps={({ disabled, openModal, signTx }) => (
        <React.Fragment>
          <button
            disabled={disabled}
            className={`SendButton btn btn-primary btn-block ${className}`}
            onClick={() => {
              signedTx ? openModal() : (signTx(), openModal());
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
