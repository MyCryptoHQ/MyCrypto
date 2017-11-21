import React from 'react';
import { GetTransactionMetaFields } from './MetaFields';
import { GetTransactionFields } from './TransactionFields';
import { TokenValue, Wei } from 'libs/units';

interface Props {
  withValue({ value }: { value: Wei | TokenValue | null });
}
// Grabs the current unit, then deduces to send the component an ether or token based value
export const CurrentValue: React.SFC<Props> = ({ withValue }) => (
  <GetTransactionMetaFields
    withFieldValues={({ unit, tokenValue }) =>
      unit === 'ether' ? (
        withValue({ value: tokenValue.value })
      ) : (
        <GetTransactionFields
          withFieldValues={({ value }) => withValue({ value: value.value })}
        />
      )
    }
  />
);
