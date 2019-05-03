import React from 'react';

import translate from 'translations';
import { IBaseDomainRequest } from 'libs/ens';
import { ensV3Url } from 'utils/formatters';
import { NewTabLink } from 'components/ui';

export const NameForbidden: React.SFC<IBaseDomainRequest> = props => (
  <section className="row">
    <section className="auction-info text-center">
      <div className="ens-title">
        <h1>{translate('ENS_DOMAIN_FORBIDDEN', { $name: props.name + '.eth' })}</h1>
        <h3>
          <NewTabLink className="text-center" href={ensV3Url(props.name + '.eth')}>
            {translate('ENS_SEND_TO_MANAGER', { $name: props.name + '.eth' })}
          </NewTabLink>
        </h3>
      </div>
    </section>
  </section>
);
