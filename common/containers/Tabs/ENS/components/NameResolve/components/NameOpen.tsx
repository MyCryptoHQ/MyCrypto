import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';

export const NameOpen: React.SFC<IBaseDomainRequest> = props => {
  const domainName = `${props.name}.eth`;
  return (
    <section className="col-xs-12 col-sm-6 col-sm-offset-3 text-center">
      <h1>
        <strong>{domainName} is available!</strong>
      </h1>
      <h4>
        {' '}
        Do you want {domainName}? Unlock your wallet to start an auction.
      </h4>
    </section>
  );
};
