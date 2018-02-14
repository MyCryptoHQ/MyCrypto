import React from 'react';
import { IRevealDomainRequest } from 'libs/ens';
import ENSTime from './components/ENSTime';
import { UnitDisplay, NewTabLink } from 'components/ui';
import { Wei } from 'libs/units';
import { ensV3Url } from 'utils/formatters';

export const NameReveal: React.SFC<IRevealDomainRequest> = props => (
  <section className="row text-center">
    <div className="auction-info text-center">
      <div className="ens-title">
        <h2>
          It's time to reveal the bids for <strong>{props.name}.eth</strong>
          <br />
          The current highest bid is{' '}
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
      Did you bid on {props.name}.eth? You must reveal your bid now.{' '}
      <strong>
        <NewTabLink href={ensV3Url(props.name)}>
          You can do that on MyCrypto v3 by clicking here!
        </NewTabLink>
      </strong>
    </p>
  </section>
);
