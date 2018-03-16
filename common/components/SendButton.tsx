import React from 'react';
import { SendButtonFactory } from './SendButtonFactory';
import translate from 'translations';
import { ConfirmationModal } from 'components/ConfirmationModal';

export const SendButton: React.SFC<{
  className?: string;
  onlyTransactionParameters?: boolean;
  toggleDisabled?: boolean;
  customModal?: typeof ConfirmationModal;
}> = ({ onlyTransactionParameters, toggleDisabled, customModal, className }) => (
  <SendButtonFactory
    onlyTransactionParameters={!!onlyTransactionParameters}
    toggleDisabled={toggleDisabled}
    Modal={customModal ? customModal : ConfirmationModal}
    withProps={({ disabled, onClick }) => (
      <div className={className}>
        <div className="col-xs-12">
          <button disabled={disabled} className="btn btn-primary btn-block" onClick={onClick}>
            {translate('SEND_trans')}
          </button>
        </div>
      </div>
    )}
  />
);
