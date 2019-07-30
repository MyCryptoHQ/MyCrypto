import React from 'react';

import { getIsValidENSAddressFunction } from 'libs/validators';

import translate from 'translations';
import { Spinner } from './Spinner';

export const ENSStatus: React.SFC<{
  isLoading: boolean;
  ensAddress: string;
  rawAddress: string;
  chainId: number;
}> = ({ isLoading, ensAddress, rawAddress, chainId }) => {
  const isValidENS = getIsValidENSAddressFunction(chainId);
  const isENS = isValidENS(ensAddress);

  const text = translate('LOADING_ENS_ADDRESS');

  if (isLoading) {
    return (
      <React.Fragment>
        <Spinner /> {text}
      </React.Fragment>
    );
  } else {
    return isENS ? <React.Fragment>{`Resolved Address: ${rawAddress}`}</React.Fragment> : null;
  }
};
