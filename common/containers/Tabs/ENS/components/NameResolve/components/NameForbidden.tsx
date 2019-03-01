import React from 'react';

import translate from 'translations';
import { IENSBaseDomainRequest } from 'libs/nameServices/ens';

export const NameForbidden: React.SFC<IENSBaseDomainRequest> = props => (
  <h1>{translate('ENS_DOMAIN_FORBIDDEN', { $name: props.name + '.eth' })}</h1>
);
