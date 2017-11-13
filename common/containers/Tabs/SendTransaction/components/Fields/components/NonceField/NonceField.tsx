import React from 'react';
import { DefaultNonceInput, Props as DNProps } from './DefaultNonceInput';
import { Nonce } from 'components/renderCbs';

interface Props {
  withNonce: DNProps['onChange'];
}

export const NonceField: React.SFC<Props> = ({ withNonce }) => (
  <Nonce
    withNonce={({ nonce }) => (
      <DefaultNonceInput defaultNonce={nonce} onChange={withNonce} />
    )}
  />
);
