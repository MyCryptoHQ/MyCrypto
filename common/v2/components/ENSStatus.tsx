import React from 'react';

import translate, { translateRaw } from 'v2/translations';
import { getIsValidENSAddressFunction } from 'v2/services/EthService';
import { Spinner } from './Spinner';

export const ENSStatus: React.SFC<{
  isLoading: boolean;
  isError: boolean;
  ensName: string;
  rawAddress: string;
  chainId: number;
}> = ({ isLoading, isError, ensName, rawAddress, chainId }) => {
  const isValidENS = getIsValidENSAddressFunction(chainId);
  const isENS = isValidENS(ensName);
  const isResolvedENS = !isValidENS(rawAddress);

  const text = translate('LOADING_ENS_ADDRESS');

  const resolverText: string = isENS
    ? isResolvedENS
      ? translateRaw('SEND_ASSETS_ENS_DID_RESOLVE')
      : translateRaw('SEND_ASSETS_ENS_WILL_RESOLVE')
    : '';

  if (isLoading) {
    return (
      <React.Fragment>
        <Spinner /> {text}
      </React.Fragment>
    );
  } else {
    return isENS && !isError ? (
      <React.Fragment>{`${resolverText}: ${rawAddress}`}</React.Fragment>
    ) : null;
  }
};
