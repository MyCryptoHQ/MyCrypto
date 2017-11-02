import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { Aux } from 'components/ui';

export const NameOpen: React.SFC<IBaseDomainRequest> = props => {
  const domainName = `${props.name}.eth`;
  return (
    <Aux>
      <h1>
        <strong>{domainName} is available!</strong>
      </h1>
      <h4>
        {' '}
        Do you want {domainName}? Unlock your wallet to start an auction.
      </h4>
    </Aux>
  );
};
