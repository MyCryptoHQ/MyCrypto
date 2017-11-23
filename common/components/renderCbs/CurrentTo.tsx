import { GetTransactionMetaFields } from './MetaFields';
import { GetTransactionFields } from './TransactionFields';
import React from 'react';
import { Address } from 'libs/units';

interface Props {
  withCurrentTo({ to }: { to: { raw: string; value: Address | null } });
}
export const CurrentTo: React.SFC<Props> = ({ withCurrentTo }) => (
  <GetTransactionMetaFields
    withFieldValues={({ unit, tokenTo }) => (
      <GetTransactionFields
        withFieldValues={({ to }) =>
          unit === 'ether'
            ? withCurrentTo({ to })
            : withCurrentTo({ to: tokenTo })
        }
      />
    )}
  />
);
