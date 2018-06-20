import React from 'react';

import translate from 'translations';
import { IBaseDomainRequest } from 'libs/ens';

export const NameForbidden: React.SFC<IBaseDomainRequest> = props => (
  <h1>{translate('ENS_DOMAIN_FORBIDDEN', { $name: props.name + '.eth' })}</h1>
);
