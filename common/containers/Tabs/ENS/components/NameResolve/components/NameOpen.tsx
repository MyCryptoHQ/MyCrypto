import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { ENSWallet } from './ENSWallet';

export const NameOpen: React.SFC<IBaseDomainRequest> = props => (
  <section className="row text-center">
    <section className="col-xs-12 col-sm-6 col-sm-offset-3 text-center">
      <h1>
        <strong>{props.name}.eth is available!</strong>
      </h1>
    </section>
    <ENSWallet
      text={`Do you want ${props.name}.eth? Unlock your wallet to start an auction.`}
    >
      {wallet => {
        return <p> Placeholder: {JSON.stringify(wallet)} </p>;
      }}
    </ENSWallet>
  </section>
);
