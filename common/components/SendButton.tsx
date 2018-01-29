import React from 'react';
import { SendButtonFactory } from './SendButtonFactory';
import translate from 'translations';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { BidModal } from 'containers/Tabs/ENS/components/NameResolve/components/components/PlaceBid/components';

export const SendButton: React.SFC<{
  onlyTransactionParameters?: boolean;
  customModal?: typeof BidModal;
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
