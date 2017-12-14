import React from 'react';
import translate from 'translations';
import { Aux } from 'components/ui';
import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { OfflineBroadcast } from './OfflineBroadcast';
import { SerializedTransaction } from 'components/renderCbs';
import { OnlineSend } from './OnlineSend';
import { addHexPrefix } from 'ethereumjs-util';
const getStringifiedTx = (serializedTransaction: string) =>
  JSON.stringify(getTransactionFields(makeTransaction(serializedTransaction)), null, 2);

export interface CallbackProps {
  onClick(): void;
}

interface Props {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}
export const SendButtonFactory: React.SFC<Props> = ({ withProps }) => (
  <SerializedTransaction
    withSerializedTransaction={serializedTransaction => (
      <Aux>
        <div className="col-sm-6">
          <label>{translate('SEND_raw')}</label>
          <textarea
            className="form-control"
            value={getStringifiedTx(serializedTransaction)}
            rows={4}
            readOnly={true}
          />
        </div>
        <div className="col-sm-6">
          <label>{translate('SEND_signed')}</label>
          <textarea
            className="form-control"
            value={addHexPrefix(serializedTransaction)}
            rows={4}
            readOnly={true}
          />
        </div>
        <OfflineBroadcast />
        <OnlineSend withProps={withProps} />
      </Aux>
    )}
  />
);
