import React from 'react';
import { Query, Param } from './Query';

interface Props {
  whenQueryExists: React.ReactElement<any> | null;
}

const params: Param[] = ['to', 'data', 'tokenSymbol', 'value', 'gaslimit', 'limit', 'readOnly'];

export const WhenQueryExists: React.SFC<Props> = ({ whenQueryExists }) => (
  <Query
    params={params}
    withQuery={queries => (Object.values(queries).some(v => !!v) ? whenQueryExists : null)}
  />
);
