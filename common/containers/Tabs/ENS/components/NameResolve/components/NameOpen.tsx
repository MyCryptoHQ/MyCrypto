import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { NewTabLink } from 'components/ui';
import { ensV3Url } from 'utils/formatters';
import translate from 'translations';

export const NameOpen: React.SFC<IBaseDomainRequest> = props => (
  <section className="row">
    <section className="auction-info text-center">
      <div className="ens-title">
        <h1>{translate('ENS_DOMAIN_OPEN', { $name: props.name + '.eth' })}</h1>
      </div>
      <p>
        Do you want {props.name}.eth?{' '}
        <strong>
          <NewTabLink className="text-center" href={ensV3Url(props.name)}>
            Open an auction on MyCrypto v3!
          </NewTabLink>
        </strong>
      </p>
    </section>
  </section>
);
