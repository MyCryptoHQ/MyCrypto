import React from 'react';

import translate from 'translations';
import { IBaseDomainRequest } from 'libs/ens';
import { ensV3Url } from 'utils/formatters';
import { NewTabLink } from 'components/ui';

export const NameNotYetAvailable: React.SFC<IBaseDomainRequest> = props => (
  <section className="row">
    <section className="auction-info text-center">
      <div className="ens-title">
        <h1>
          {translate('ENS_DOMAIN_UNAVAILABLE', { $name: props.name + '.eth' })}.{' '}
          {translate('ENS_INVALID_INPUT')}.
        </h1>
        <h3>
          <NewTabLink className="text-center" href={ensV3Url(props.name)}>
            {translate('ENS_SEND_TO_MANAGER', { $name: props.name + '.eth' })}
          </NewTabLink>
        </h3>
      </div>
    </section>
  </section>
);
