import React from 'react';
import { IRevealDomainRequest } from 'libs/ens';
import { EnsTime } from './CountDown';
import { UnitDisplay } from 'components/ui';
import { Wei } from 'libs/units';
import { ENSWallet } from './ENSWallet';

export const NameReveal: React.SFC<IRevealDomainRequest> = props => (
  <section className="row text-center">
    <h1>
      <p>
        It's time to reveal the bids for <strong>{props.name}.eth.</strong>{' '}
      </p>
      <p>
        Current Highest bid is {' '}
        <strong>
          <UnitDisplay
            value={Wei(props.highestBid)}
            unit="ether"
            symbol="ETH"
            displayShortBalance={false}
          />
        </strong>
      </p>
    </h1>
    <EnsTime text="Auction closes on" time={+props.registrationDate * 1000} />

    <ENSWallet
      text={`Did you you bid on ${props.name}.eth? You must reveal your bid now.`}
    >
      {wallet => {
        return <p> Placeholder: {JSON.stringify(wallet)} </p>;
      }}
    </ENSWallet>
  </section>
);
