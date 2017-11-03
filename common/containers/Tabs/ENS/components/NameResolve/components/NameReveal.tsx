import React from 'react';
import { IRevealDomainRequest } from 'libs/ens';
import { EnsTime } from './CountDown';

export const NameReveal: React.SFC<IRevealDomainRequest> = props => {
  return (
    <section className="row text-center">
      <h1>
        <p>
          It's time to reveal the bids for <strong>{props.name}.eth.</strong>{' '}
        </p>
        <p>Current Highest bid is </p>
      </h1>
      <EnsTime text="Auction closes on" time={+props.registrationDate * 1000} />
    </section>
  );
};
