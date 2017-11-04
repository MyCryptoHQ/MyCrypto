import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';

export const NameNotYetAvailable: React.SFC<IBaseDomainRequest> = props => (
  <h1>The name {props.name}.eth is not yet available</h1>
);
