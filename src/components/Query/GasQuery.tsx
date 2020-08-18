import React from 'react';

import { Query } from './Query';

interface Props {
  withQuery({ gasLimit }: { gasLimit: string | null }): React.ReactElement<any>;
}

export const GasQuery: React.FC<Props> = ({ withQuery }) => (
  <Query
    params={['gasLimit']}
    withQuery={({ limit, gaslimit }) => withQuery({ gasLimit: limit || gaslimit })}
  />
);
