import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import ENSTime from './components/ENSTime';
import moment from 'moment';
import { NewTabLink } from 'components/ui';
import { ensV3Url } from 'utils/formatters';

const getDeadlines = (registrationDate: string) => {
  // Get the time to reveal bids, and the time when the action closes
  const time = moment(+registrationDate * 1000);
  const auctionCloseTime = +time;
  const revealBidTime = +time.subtract(2, 'days');
  return { auctionCloseTime, revealBidTime };
};

export const NameAuction: React.SFC<IBaseDomainRequest> = props => {
  const { registrationDate, name } = props;
  const { auctionCloseTime, revealBidTime } = getDeadlines(registrationDate);
  return (
    <section className="row">
      <div className="auction-info text-center">
        <div className="ens-title">
          <h1>
            An auction has started for <strong>{name}.eth</strong>
          </h1>
        </div>

        <div className="ens-panel-wrapper">
          <section className="ens-panel">
            <ENSTime text="Reveal Bids On" time={revealBidTime} />
          </section>
          <section className="ens-panel is-light">
            <ENSTime text="Auction Closes On" time={auctionCloseTime} />
          </section>
        </div>

        <p>
          Do you want to place a bid on {name}.eth?{' '}
          <strong>
            <NewTabLink href={ensV3Url(name)}>
              You can do that on MyCrypto V3 by clicking here!
            </NewTabLink>
          </strong>
        </p>
      </div>
    </section>
  );
};
