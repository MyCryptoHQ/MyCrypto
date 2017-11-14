import React from 'react';
import { DefaultNonceInput } from './DefaultNonceInput';
import { Nonce, SetTransactionFields } from 'components/renderCbs';

export const NonceField: React.SFC<{}> = () => (
  <SetTransactionFields
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
