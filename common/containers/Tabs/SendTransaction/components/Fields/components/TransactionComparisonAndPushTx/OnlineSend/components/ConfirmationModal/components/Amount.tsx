import React from 'react';
import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { SerializedTransaction, GetTransactionMetaFields } from 'components/renderCbs';
import { UnitDisplay } from 'components/ui';
import { Wei, TokenValue } from 'libs/units';
import ERC20 from 'libs/erc20';
export const Amount: React.SFC<{}> = () => (
  <SerializedTransaction
    withSerializedTransaction={serializedTransaction => {
      const transactionInstance = makeTransaction(serializedTransaction);
      const { value, data } = getTransactionFields(transactionInstance);

      return (
        <GetTransactionMetaFields
          withFieldValues={({ decimal, unit }) => (
            <UnitDisplay
              decimal={decimal}
              value={
                unit === 'ether' ? Wei(value) : TokenValue(ERC20.transfer.decodeInput(data)._value)
              }
              symbol={unit}
            />
          )}
        />
      );
    }}
  />
);
