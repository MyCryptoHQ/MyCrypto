import React from 'react';
import { getTransactionFields, transaction } from 'libs/transaction';
import { SerializedTransaction } from 'components/renderCbs';
import { UnitDisplay } from 'components/ui';
import { Wei } from 'libs/units';

export const GasPrice: React.SFC<{}> = () => (
  <SerializedTransaction
    withSerializedTransaction={serializedTransaction => {
      const transactionInstance = transaction(serializedTransaction);
      const { gasPrice } = getTransactionFields(transactionInstance);

      return (
        <p>
          with a gas price of{' '}
          <strong>
            <UnitDisplay unit={'gwei'} value={Wei(gasPrice)} symbol={'gwei'} />
          </strong>
        </p>
      );
    }}
  />
);
