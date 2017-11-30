import { EtherBalance } from './EtherBalance';
import { TokenBalances } from './TokenBalances';
import { GetTransactionMetaFields } from './MetaFields';
import React from 'react';
import { Wei } from 'libs/units';

interface Props {
  withBalance({
    balance
  }: {
    balance: Wei | null | undefined;
  }): React.ReactElement<any> | null;
}

// Grabs the current unit, then deduces to send the component an ether or token based balance

export const CurrentBalance: React.SFC<Props> = ({ withBalance }) => (
  <GetTransactionMetaFields
    withFieldValues={({ unit }) =>
      unit === 'ether' ? (
        <EtherBalance
          withBalance={({ balance }) => withBalance({ balance: balance.wei })}
        />
      ) : (
        <TokenBalances
          nonZeroBalances={true}
          withTokens={({ tokens }) => {
            const currentToken = tokens.filter(t => t.symbol === unit); // TODO: Need a better way of selecting tokens if there are symbol conflicts
            return withBalance({ balance: currentToken[0].balance });
          }}
        />
      )
    }
  />
);
