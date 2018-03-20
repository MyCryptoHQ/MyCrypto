import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { translateMd } from 'translations';

export const NameForbidden: React.SFC<IBaseDomainRequest> = props => (
  <h1>{translateMd('ENS_DOMAIN_FORBIDDEN', { $name: props.name + '.eth' })}</h1>
);
