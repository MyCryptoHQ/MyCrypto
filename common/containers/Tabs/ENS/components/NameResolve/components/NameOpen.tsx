import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { ENSWallet } from './ENSWallet';
import { PlaceBid } from './PlaceBid';
import { BalanceSidebar } from 'components';

export const NameOpen: React.SFC<IBaseDomainRequest> = props => (
  <section className="row">
    <section className="col-xs-12 col-sm-6 col-sm-offset-3 text-center">
      <div className="ens-title">
        <h1>
          <strong>{props.name}.eth</strong> is available!
        </h1>
      </div>
    </section>
    <ENSWallet text={`Do you want ${props.name}.eth? Unlock your wallet to start an auction.`}>
      {wallet => {
        return (
          <div>
            <div className="col-xs-8">
              <PlaceBid
                buttonName="Start the Auction"
                title="Start an Auction"
                {...props}
              />
            </div>
            <div className="col-xs-4">
              <BalanceSidebar />
            </div>
          </div>
        );
      }}
    </ENSWallet>
  </section>
);
