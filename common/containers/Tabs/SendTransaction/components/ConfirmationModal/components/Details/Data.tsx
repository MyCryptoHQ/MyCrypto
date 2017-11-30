import React from 'react';
import { getTransactionFields, transaction } from 'libs/transaction';
import {
  SerializedTransaction,
  GetTransactionMetaFields
} from 'components/renderCbs';

const Data: React.SFC<{}> = () => (
  <SerializedTransaction
    withSerializedTransaction={serializedTransaction => {
      const transactionInstance = transaction(serializedTransaction);
      const { data } = getTransactionFields(transactionInstance);
      const dataBox = (
        <span>
          You are sending the following data:{' '}
          <textarea
            className="form-control"
            value={data}
            rows={3}
            disabled={true}
          />
        </span>
      );

      return (
        <li className="ConfModal-details-detail">
          {!emptyData(data)
            ? { dataBox }
            : 'There is no data attached to this transaction'}
        </li>
      );
    }}
  />
);

const emptyData = (data: string) => data === '0x';

const ShowDataWhenNoToken: React.SFC<{}> = () => (
  <GetTransactionMetaFields
    withFieldValues={({ unit }) => (unit === 'ether' ? <Data /> : null)}
  />
);

export { ShowDataWhenNoToken as Data };
