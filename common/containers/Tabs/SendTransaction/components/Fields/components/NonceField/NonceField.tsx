import React from 'react';
import { DefaultNonceInput } from './DefaultNonceInput';
import { Nonce, SetTransactionField } from 'components/renderCbs';

export const NonceField: React.SFC<{}> = () => (
  <SetTransactionField
    name="nonce"
    withFieldSetter={setter => (
      <Nonce
        withNonce={({ nonce }) => (
          <DefaultNonceInput defaultNonce={nonce} setter={setter} />
        )}
      />
    )}
  />
);
