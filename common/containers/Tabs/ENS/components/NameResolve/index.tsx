import React from 'react';
import { AppState } from 'reducers';
import { NameState } from 'libs/ens';
import {
  NameOwned,
  NameAuction,
  NameForbidden,
  NameNotYetAvailable,
  NameOpen,
  NameReveal
} from './components';

type Props = AppState['ens'];

const modeResult = {
  [NameState.Auction]: NameAuction,
  [NameState.Forbidden]: NameForbidden,
  [NameState.NotYetAvailable]: NameNotYetAvailable,
  [NameState.Open]: NameOpen,
  [NameState.Owned]: NameOwned,
  [NameState.Reveal]: NameReveal
};

export const NameResolve: React.SFC<Props> = props => {
  const { domainRequests, domainSelector } = props;
  const { currentDomain } = domainSelector;

  if (
    !currentDomain ||
    !domainRequests[currentDomain] ||
    domainRequests[currentDomain].error
  ) {
    return null;
  }

  const domain = domainRequests[currentDomain];
  if (domain.state === 'PENDING') {
    //TODO: display spinner
    return null;
  }
  const Component = modeResult[domain.data!.mode];

  return <Component {...domain.data!} />;
};
