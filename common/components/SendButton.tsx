import React from 'react';
import { SendButtonFactory } from './SendButtonFactory';
import translate from 'translations';

export const SendButton: React.SFC<{ onlyTransactionParameters?: boolean }> = ({
  onlyTransactionParameters
}) => (
  <SendButtonFactory
    onlyTransactionParameters={!!onlyTransactionParameters}
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
