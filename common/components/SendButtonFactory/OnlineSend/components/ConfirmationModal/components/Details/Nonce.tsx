import React from 'react';
import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { SerializedTransaction } from 'components/renderCbs';

export const Nonce: React.SFC<{}> = () => (
  <SerializedTransaction
    withSerializedTransaction={serializedTransaction => {
      const transactionInstance = makeTransaction(serializedTransaction);
      const { nonce } = getTransactionFields(transactionInstance);

      return (
        <li className="ConfModal-details-detail">
          You are sending with a nonce of <code>{nonce}</code>
        </li>
      );
    }}
  />
);
