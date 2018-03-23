import React from 'react';
import { SendButtonFactory } from './SendButtonFactory';
import translate from 'translations';
import { ConfirmationModal } from 'components/ConfirmationModal';

export const SendButton: React.SFC<{
  onlyTransactionParameters?: boolean;
  toggleDisabled?: boolean;
  customModal?: typeof ConfirmationModal;
}> = ({ onlyTransactionParameters, toggleDisabled, customModal }) => (
  <SendButtonFactory
    onlyTransactionParameters={!!onlyTransactionParameters}
    toggleDisabled={toggleDisabled}
    Modal={customModal ? customModal : ConfirmationModal}
    withProps={({ disabled, onClick }: { disabled: boolean; onClick(): void }) => (
      <div className="row form-group">
        <div className="col-xs-12">
          <button disabled={disabled} className="btn btn-primary btn-block" onClick={onClick}>
            {translate('SEND_TRANS')}
          </button>
        </div>
      </div>
    )}
  />
);
