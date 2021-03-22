import { getUnlockTimestamps, TimestampMap } from '@mycrypto/unlock-scan';

import {
  MEMBERSHIP_CONFIG,
  MEMBERSHIP_CONTRACTS,
  MembershipStatus
} from '@features/PurchaseMembership/config';
import { ProviderHandler } from '@services/EthService/';
import { Bigish, Network, NetworkId, TAddress } from '@types';
import { bigify } from '@utils';
import { mapObjIndexed, pickBy, pipe, toString } from '@vendor';

export const getMembershipContracts = (membershipNetworkId: NetworkId) =>
  Object.values(MEMBERSHIP_CONFIG)
    .filter(({ networkId }) => networkId === membershipNetworkId)
    .map((membership) => membership.contractAddress);

const isSafeInt = (bn: Bigish) => bn.isLessThanOrEqualTo(bigify(Number.MAX_SAFE_INTEGER));

export const formatResponse = (networkId: NetworkId) => (timestamps: TimestampMap) => {
  // We receive timestamps in the form of hex values.
  // Convert to Bigies so we can determine their expiry date.
  // @todo: prefer date-fns for time comparisons.
  const expiries = pipe(
    mapObjIndexed(mapObjIndexed(bigify)),
    mapObjIndexed(pickBy(isSafeInt)),
    mapObjIndexed(mapObjIndexed(toString))
  )(timestamps);

  return Object.keys(expiries)
    .map((address: TAddress) => ({
      address,
      networkId,
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
      contracts: getMembershipContracts(network.id)
    }).then(formatResponse(network.id));
  }
};

export default MembershipApi;
