import { getUnlockTimestamps } from '@mycrypto/unlock-scan';
import BigNumber from 'bignumber.js';
import { PromiseType } from 'utility-types';

import {
  MEMBERSHIP_CONTRACTS,
  MEMBERSHIP_CONTRACTS_ADDRESSES,
  MembershipStatus
} from '@features/PurchaseMembership/config';
import { ProviderHandler } from '@services/EthService/';
import { convertBNToBigNumberJS } from '@services/Store/BalanceService';
import { Network, TAddress } from '@types';
import { map, pipe } from '@vendor';

export const formatResponse = (timestamps: PromiseType<ReturnType<typeof getUnlockTimestamps>>) => {
  const res = pipe(map(map(convertBNToBigNumberJS)));
  const expiries = res(timestamps);

  return Object.keys(expiries)
    .map((address: TAddress) => ({
      address,
      memberships: Object.keys(expiries[address])
        .filter((contract) => expiries[address][contract].isGreaterThan(new BigNumber(0)))
        .map((contract) => ({
          type: MEMBERSHIP_CONTRACTS[contract],
          expiry: expiries[address][contract]
        }))
    }))
    .filter((m) => m.memberships.length > 0);
};

const MembershipApi = {
  async getMemberships(addresses: TAddress[] = [], network: Network): Promise<MembershipStatus[]> {
    const provider = new ProviderHandler(network);
    return getUnlockTimestamps(provider, addresses, {
      contracts: MEMBERSHIP_CONTRACTS_ADDRESSES
    }).then(formatResponse);
  }
};

export default MembershipApi;
