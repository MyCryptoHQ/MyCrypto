import React from 'react';
import { SendButtonFactory } from './SendButtonFactory';
import translate from 'translations';
import { ConfirmationModalTemplate } from 'components/ConfirmationModalTemplate';

export const SendButton: React.SFC<{
  onlyTransactionParameters?: boolean;
  customModal?: typeof ConfirmationModalTemplate;
}> = ({ onlyTransactionParameters, customModal }) => (
  <SendButtonFactory
    onlyTransactionParameters={!!onlyTransactionParameters}
    Modal={customModal ? customModal : ConfirmationModalTemplate}
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
