import { Identicon } from 'components/ui';
import React from 'react';
import {
  GetTransactionMetaFields,
  SerializedTransaction
} from 'components/renderCbs';
import { transaction, getTransactionFields } from 'libs/transaction';
import ERC20 from 'libs/erc20';

//got duplication here
export const SummaryTo: React.SFC<{}> = () => (
  <SerializedTransaction
    withSerializedTransaction={serializedTransaction => {
      const transactionInstance = transaction(serializedTransaction);
      const { to, data } = getTransactionFields(transactionInstance);

      return (
        <div className="ConfModal-summary-icon ConfModal-summary-icon--to">
          <GetTransactionMetaFields
            withFieldValues={({ unit }) => (
              <Identicon
                size="100%"
                address={
                  unit === 'ether' ? to : ERC20.transfer.decodeInput(data)._to
                }
              />
            )}
          />
        </div>
      );
    }}
  />
);
