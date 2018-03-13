import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { translateMarkdown } from 'translations';

export const NameForbidden: React.SFC<IBaseDomainRequest> = props => (
  <h1>{translateMarkdown('ENS_DOMAIN_FORBIDDEN', { var_name: props.name + '.eth' })}</h1>
);
