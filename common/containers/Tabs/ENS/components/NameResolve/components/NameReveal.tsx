import React from 'react';
import { IRevealDomainRequest } from 'libs/ens';
import ENSTime from './components/ENSTime';
import { UnitDisplay } from 'components/ui';
import { Wei } from 'libs/units';
import { ensV3Url } from 'utils/formatters';
import translate from 'translations';

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

    <p>
      {translate('ENS_DOMAIN_PROMPT_REVEAL', {
        $name: props.name + '.eth',
        $link: ensV3Url(props.name)
      })}
    </p>
  </section>
);
