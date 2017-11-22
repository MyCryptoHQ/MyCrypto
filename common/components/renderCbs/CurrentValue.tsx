import React from 'react';
import { GetTransactionMetaFields } from './MetaFields';
import { GetTransactionFields } from './TransactionFields';
import { TokenValue, Wei } from 'libs/units';

interface Props {
  withValue({
    value
  }: {
    value: { raw: string; value: TokenValue | Wei | null };
  });
}
// Grabs the current unit, then deduces to send the component an ether or token based value
export const CurrentValue: React.SFC<Props> = ({ withValue }) => (
  <GetTransactionMetaFields
    withFieldValues={({ unit, tokenValue }) =>
      unit === 'ether' ? (
        <GetTransactionFields
          withFieldValues={({ value }) => withValue({ value })}
        />
      ) : (
        withValue({ value: tokenValue })
      )
    }
  />
);
