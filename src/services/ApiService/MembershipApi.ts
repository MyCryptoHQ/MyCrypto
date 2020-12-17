import { getUnlockTimestamps } from '@mycrypto/unlock-scan';
import { PromiseType } from 'utility-types';

import {
  MEMBERSHIP_CONTRACTS,
  MEMBERSHIP_CONTRACTS_ADDRESSES,
  MembershipStatus
} from '@features/PurchaseMembership/config';
import { ProviderHandler } from '@services/EthService/';
import { Bigish, Network, TAddress } from '@types';
import { bigify } from '@utils';
import { mapObjIndexed, pickBy, pipe, toString } from '@vendor';

const isSafeInt = (bn: Bigish) => bn.isLessThanOrEqualTo(bigify(Number.MAX_SAFE_INTEGER));

export const formatResponse = (timestamps: PromiseType<ReturnType<typeof getUnlockTimestamps>>) => {
  // We receive timestamps in the form of hex values.
  // Convert to Bigies so we can determine their expiry date.
  // @todo: prefer date-fns for time comparaisons.
  const expiries = pipe(
    mapObjIndexed(mapObjIndexed(bigify)),
    mapObjIndexed(pickBy(isSafeInt)),
    mapObjIndexed(mapObjIndexed(toString))
  )(timestamps);

  return Object.keys(expiries)
    .map((address: TAddress) => ({
      address,
      memberships: Object.keys(expiries[address])
        .filter((contract) => expiries[address][contract] !== '0')
        .map((contract) => ({
          type: MEMBERSHIP_CONTRACTS[contract],
          expiry: expiries[address][contract]
        }))
    }))
    .filter((m) => m.memberships.length > 0);
};

const MembershipApi = {
  getMemberships(addresses: TAddress[] = [], network: Network): Promise<MembershipStatus[]> {
    const provider = new ProviderHandler(network);
    return getUnlockTimestamps(provider, addresses, {
      contracts: MEMBERSHIP_CONTRACTS_ADDRESSES
    }).then(formatResponse);
  }
};

export default MembershipApi;
