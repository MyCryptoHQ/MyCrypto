import React from 'react';

import { Text } from '@components/NewTypography';
import { getUniClaims, useSelector } from '@store';
import { translateRaw } from '@translations';
import { ClaimState } from '@types';

export const UniClaimSubHead = () => {
  const uniClaims = useSelector(getUniClaims);

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
