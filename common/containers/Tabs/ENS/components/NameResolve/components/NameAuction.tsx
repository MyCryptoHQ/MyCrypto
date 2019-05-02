import React from 'react';
import moment from 'moment';

import translate from 'translations';
import { IBaseDomainRequest } from 'libs/ens';
import { ensV3Url } from 'utils/formatters';
import { NewTabLink } from 'components/ui';
import ENSTime from './components/ENSTime';

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
          <h1>{translate('ENS_DOMAIN_AUCTION', { $name: name + '.eth' })}</h1>
        </div>

        <div className="ens-panel-wrapper">
          <section className="ens-panel">
            <ENSTime text="Reveal Bids On" time={revealBidTime} />
          </section>
          <section className="ens-panel is-light">
            <ENSTime text="Auction Closes On" time={auctionCloseTime} />
          </section>
        </div>

        <h1>{translate('NAME_AUCTION_PROMPT_BID')}</h1>
        <h3>
          <NewTabLink className="text-center" href={ensV3Url(name + '.eth')}>
            {translate('ENS_SEND_TO_MANAGER', { $name: name + '.eth' })}
          </NewTabLink>
        </h3>
      </div>
    </section>
  );
};
