import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { EnsTime } from './CountDown';
import { ENSWallet } from './ENSWallet';
import { PlaceBid } from './PlaceBid';
import ENSUnlockLayout from './ENSUnlockLayout';
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
    <section className="row">
      <h1>
        An auction has been started for <strong>{name}.eth.</strong>
      </h1>

      <section className="col-sm-6 col-xs-12 order-info">
        <EnsTime text="Reveal Bids On" time={revealBidTime} />
      </section>
      <section className="col-sm-6 col-xs-12 order-info">
        <EnsTime text="Auction Closes On" time={auctionCloseTime} />
      </section>
      <ENSWallet
        text={`Do you want ${name}.eth? Unlock your wallet to place a bid.`}
      >
        {/* TODO: find a better way of conditionally rendering on wallet unlock */}
        {wallet ? (
          <ENSUnlockLayout>
            <PlaceBid
              buttonName="Start the Auction"
              title="Start an Auction"
              {...props}
            />
          </ENSUnlockLayout>
        ) : null}
      </ENSWallet>
    </section>
  );
};
