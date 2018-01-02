import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import ENSTime from './components/ENSTime';
import { ENSWallet } from './components/ENSWallet';
import PlaceBid from './components/PlaceBid';
import ENSUnlockLayout from './components/ENSUnlockLayout';
import moment from 'moment';

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
          <section className="ens-panel ens-panel-light">
            <ENSTime text="Auction Closes On" time={auctionCloseTime} />
          </section>
        </div>
      </div>

      <ENSWallet text={`Do you want ${name}.eth? Unlock your wallet to place a bid.`}>
        <ENSUnlockLayout>
          <PlaceBid buttonName="Place Bid" title="Place A Bid" {...props} />
        </ENSUnlockLayout>
      </ENSWallet>
    </section>
  );
};
