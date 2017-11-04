import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';

export const NameForbidden: React.SFC<IBaseDomainRequest> = props => (
  <h1>The name {props.name}.eth is forbidden</h1>
);
