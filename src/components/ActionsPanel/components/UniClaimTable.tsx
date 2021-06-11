import React from 'react';

import { getUniClaims, useSelector } from '@store';
import { Asset, ClaimResult, ClaimState } from '@types';
import { filter, map, pick, pipe, propEq } from '@vendor';

import { ActionTable } from './ActionTable';

export const UniClaimTable = () => {
  const uniClaims = useSelector(getUniClaims);

  const isUnclaimed = propEq('state', ClaimState.UNCLAIMED);

  const filterClaimed = (uniClaims: ClaimResult[]) => filter(isUnclaimed, uniClaims);

  const toAddressAmountPair = (uniClaims: ClaimResult[]) =>
    map(pick(['address', 'amount']), uniClaims);

  const relevantAccounts = pipe(filterClaimed, toAddressAmountPair)(uniClaims);

  return <ActionTable accounts={relevantAccounts} asset={{ ticker: 'UNI' } as Asset} />;
};
