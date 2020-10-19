import React, { useContext } from 'react';

import { StoreContext } from '@services';
import { ClaimState, UniClaimResult } from '@services/ApiService/Uniswap/Uniswap';
import { Asset } from '@types';
import { filter, map, pick, pipe, propEq } from '@vendor';

import { ActionTable } from './ActionTable';

export const UniClaimTable = () => {
  const { uniClaims } = useContext(StoreContext);

  const isUnclaimed = propEq('state', ClaimState.UNCLAIMED);

  const filterClaimed = (uniClaims: UniClaimResult[]) => filter(isUnclaimed, uniClaims);

  const toAddressAmountPair = (uniClaims: UniClaimResult[]) =>
    map(pick(['address', 'amount']), uniClaims);

  const relevantAccounts = pipe(filterClaimed, toAddressAmountPair)(uniClaims);

  return <ActionTable accounts={relevantAccounts} asset={{ ticker: 'UNI' } as Asset} />;
};
