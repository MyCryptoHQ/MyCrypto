import React from 'react';
import { DefaultNonceInput } from './DefaultNonceInput';
import { Nonce } from 'components/renderCbs';

export const NonceField: React.SFC<{}> = () => (
  <Nonce withNonce={({ nonce }) => <DefaultNonceInput defaultNonce={nonce} />} />
);
