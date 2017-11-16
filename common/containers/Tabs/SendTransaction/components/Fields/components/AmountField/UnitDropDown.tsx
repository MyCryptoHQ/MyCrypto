import React from 'react';
import {
  Query,
  TokenBalances,
  SetTransactionFields,
  GetTransactionFields
} from 'components/renderCbs';
import { ConditionalUnitDropdown } from './components';

export const UnitDropDown: React.SFC<{}> = () => (
  <TokenBalances
    withTokens={({ tokens }) => (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) => (
          <SetTransactionFields
            name="unit"
            withFieldSetter={setter => (
              <GetTransactionFields
                withFieldValues={({ unit }) => (
                  <ConditionalUnitDropdown
                    value={unit.value}
                    options={['ether'].concat(tokens.map(t => t.symbol))}
                    isReadOnly={!!readOnly}
                    onChange={newUnit =>
                      setter({ raw: newUnit, value: newUnit })
                    }
                  />
                )}
              />
            )}
          />
        )}
      />
    )}
  />
);
