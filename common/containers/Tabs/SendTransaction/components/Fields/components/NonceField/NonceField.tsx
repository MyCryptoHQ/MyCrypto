import React from 'react';
import { DefaultNonceInput } from './DefaultNonceInput';
import { Nonce } from 'components/renderCbs';

interface Props {
  withNonce(nonce: string | null): void;
}

export const NonceField: React.SFC<Props> = ({ withNonce }) => (
  <Nonce
    withNonce={({ nonce }) => (
      <DefaultNonceInput defaultNonce={nonce} onChange={withNonce} />
    )}
  />
);
