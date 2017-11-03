import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { EnsTime } from './CountDown';
import moment from 'moment';

const getDeadlines = (registrationDate: string) => {
  // Get the time to reveal bids, and the time when the action closes
  const time = moment(+registrationDate * 1000);
  const auctionCloseTime = +time;
  const revealBidTime = +time.subtract(2, 'days');
  return { auctionCloseTime, revealBidTime };
};

export const NameAuction: React.SFC<IBaseDomainRequest> = ({
  registrationDate,
  name
}) => {
  const { auctionCloseTime, revealBidTime } = getDeadlines(registrationDate);
  return (
    <section className="row text-center">
      <h1>
        An auction has been started for <strong>{name}.eth.</strong>
      </h1>

      <section className="col-sm-6 col-xs-12 order-info">
        <EnsTime text="Reveal Bids On" time={revealBidTime} />
      </section>
      <section className="col-sm-6 col-xs-12 order-info">
        <EnsTime text="Auction Closes On" time={auctionCloseTime} />
      </section>
    </section>
  );
};
