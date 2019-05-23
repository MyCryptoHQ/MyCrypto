import React from 'react';

import translate from 'translations';
import { Wei } from 'libs/units';
import { IRevealDomainRequest } from 'libs/ens';
import { ensV3Url } from 'utils/formatters';
import { UnitDisplay, NewTabLink } from 'components/ui';
import ENSTime from './components/ENSTime';

export const NameReveal: React.SFC<IRevealDomainRequest> = props => (
  <section className="row text-center">
    <div className="auction-info text-center">
      <div className="ens-title">
        <h2>
          {translate('ENS_DOMAIN_REVEAL', { $name: props.name + '.eth' })}
          <br />
          {translate('ENS_DOMAIN_HIGHEST_BID')}
          <strong>
            <UnitDisplay
              value={Wei(props.highestBid)}
              unit="ether"
              symbol="ETH"
              displayShortBalance={false}
              checkOffline={false}
            />
          </strong>
        </h2>
      </div>

      <div className="ens-panel-wrapper">
        <section className="ens-panel">
          <ENSTime text="Auction closes on" time={+props.registrationDate * 1000} />
        </section>
      </div>
    </div>

    <h3>
      <NewTabLink className="text-center" href={ensV3Url(props.name + '.eth')}>
        {translate('ENS_SEND_TO_MANAGER', { $name: props.name + '.eth' })}
      </NewTabLink>
    </h3>
  </section>
);
