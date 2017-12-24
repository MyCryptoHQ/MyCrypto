import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { ENSWallet } from './components/ENSWallet';
import PlaceBid from './components/PlaceBid';
import ENSUnlockLayout from './components/ENSUnlockLayout';

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
      <ENSUnlockLayout>
        <PlaceBid buttonName="Start the Auction" title="Start an Auction" {...props} />
      </ENSUnlockLayout>
    </ENSWallet>
  </section>
);
