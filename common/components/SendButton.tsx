import React from 'react';
import { SendButtonFactory } from './SendButtonFactory';
import translate from 'translations';
import { ConfirmationModal } from 'components/ConfirmationModal';

export const SendButton: React.SFC<{
  onlyTransactionParameters?: boolean;
  customModal?: typeof ConfirmationModal;
}> = ({ onlyTransactionParameters, customModal }) => (
  <SendButtonFactory
    onlyTransactionParameters={!!onlyTransactionParameters}
    Modal={customModal ? customModal : ConfirmationModal}
    withProps={({ onClick }) => (
      <div className="row form-group">
        <div className="col-xs-12">
          <button className="btn btn-primary btn-block" onClick={onClick}>
            {translate('SEND_trans')}
          </button>
        </div>
      </div>
    )}
  />
);
