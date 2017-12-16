import React from 'react';
import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { SerializedTransaction } from 'components/renderCbs';
import { UnitDisplay } from 'components/ui';
import { Wei } from 'libs/units';

export const GasPrice: React.SFC<{}> = () => (
  <SerializedTransaction
    withSerializedTransaction={serializedTransaction => {
      const transactionInstance = makeTransaction(serializedTransaction);
      const { gasPrice } = getTransactionFields(transactionInstance);

      return (
        <p>
          with a gas price of{' '}
          <strong>
            <UnitDisplay unit={'gwei'} value={Wei(gasPrice)} symbol={'gwei'} checkOffline={false} />
          </strong>
        </p>
      );
    }}
  />
);
