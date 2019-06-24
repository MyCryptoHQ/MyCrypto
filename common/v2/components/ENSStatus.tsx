import React from 'react';
import Spinner from 'components/ui/Spinner';
import { translate } from 'translations';
import { getIsValidENSAddressFunction } from 'v2/libs/validators';

const ENSStatus: React.SFC<{
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
    return isENS ? (
      rawAddress === '' ? null : (
        <React.Fragment>{`Resolved Address: ${rawAddress}`}</React.Fragment>
      )
    ) : null;
  }
};

export default ENSStatus;
