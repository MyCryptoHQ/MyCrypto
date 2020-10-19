import React, { useContext } from 'react';

import { Text } from '@components/NewTypography';
import { StoreContext } from '@services';
import { ClaimState } from '@services/ApiService/Uniswap/Uniswap';
import { translateRaw } from '@translations';

export const UniClaimSubHead = () => {
  const { uniClaims } = useContext(StoreContext);

  const relevantAccounts = uniClaims.filter((a) => a.state === ClaimState.UNCLAIMED);
  return (
    <Text mb={0} color="GREY">
      {translateRaw(
        relevantAccounts.length > 1 ? 'UNI_CLAIM_SUBHEAD_PLURAL' : 'UNI_CLAIM_SUBHEAD',
        {
          $total: relevantAccounts.length.toString()
        }
      )}
    </Text>
  );
};
