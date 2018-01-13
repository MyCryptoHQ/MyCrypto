import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { ENSWallet } from './components/ENSWallet';
import ENSUnlockLayout from './components/ENSUnlockLayout';

export const NameOpen: React.SFC<IBaseDomainRequest> = props => (
  <section className="row">
    <section className="auction-info text-center">
      <div className="ens-title">
        <h1>
          <strong>{props.name}.eth</strong> is available!
        </h1>
      </div>
    </section>
    <ENSWallet text={`Do you want ${props.name}.eth? Unlock your wallet to start an auction.`}>
      <ENSUnlockLayout>
        {/*<PlaceBid domainName={name} buttonName="Start the Auction" title="Start an Auction" />*/}
      </ENSUnlockLayout>
    </ENSWallet>
  </section>
);
