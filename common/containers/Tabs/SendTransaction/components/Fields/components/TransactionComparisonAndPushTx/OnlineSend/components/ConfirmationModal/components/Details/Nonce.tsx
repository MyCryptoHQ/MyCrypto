import React from 'react';
import { getTransactionFields, transaction } from 'libs/transaction';
import { SerializedTransaction } from 'components/renderCbs';

export const Nonce: React.SFC<{}> = () => (
  <SerializedTransaction
    withSerializedTransaction={serializedTransaction => {
      const transactionInstance = transaction(serializedTransaction);
      const { nonce } = getTransactionFields(transactionInstance);

      return (
        <li className="ConfModal-details-detail">
          You are sending with a nonce of <code>{nonce}</code>
        </li>
      );
    }}
  />
);
