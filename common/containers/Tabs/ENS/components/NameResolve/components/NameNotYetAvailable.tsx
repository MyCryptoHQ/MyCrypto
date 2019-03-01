import React from 'react';

import { IENSBaseDomainRequest } from 'libs/nameServices/ens';

export const NameNotYetAvailable: React.SFC<IENSBaseDomainRequest> = props => (
  <h1>{props.name}.eth is not yet available</h1>
);
