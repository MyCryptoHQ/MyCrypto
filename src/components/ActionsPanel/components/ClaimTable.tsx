import { getClaims, useSelector } from '@store';
import { Asset, ClaimResult, ClaimState, ClaimType } from '@types';
import { filter, map, pick, pipe, propEq } from '@vendor';

import { ActionTable } from './ActionTable';

export const ClaimTable = ({ type }: { type: ClaimType }) => {
  const claims = useSelector(getClaims(type));

  const isUnclaimed = propEq('state', ClaimState.UNCLAIMED);

  const filterClaimed = (uniClaims: ClaimResult[]) => filter(isUnclaimed, uniClaims);

  const toAddressAmountPair = (uniClaims: ClaimResult[]) =>
    map(pick(['address', 'amount']), uniClaims);

  const relevantAccounts = pipe(filterClaimed, toAddressAmountPair)(claims);

  return <ActionTable accounts={relevantAccounts} asset={{ ticker: type } as Asset} />;
};
