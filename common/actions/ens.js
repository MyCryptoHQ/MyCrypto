// @flow

export type ResolveEnsNameAction = {
  type: 'ENS_RESOLVE',
  payload: string
};

export type CacheEnsAddressAction = {
  type: 'ENS_CACHE',
  payload: {
    ensName: string,
    address: string
  }
};

export type EnsAction = ResolveEnsNameAction | CacheEnsAddressAction;

export function resolveEnsName(name: string): ResolveEnsNameAction {
  return {
    type: 'ENS_RESOLVE',
    payload: name
  };
}

export function cacheEnsAddress(
  ensName: string,
  address: string
): CacheEnsAddressAction {
  return {
    type: 'ENS_CACHE',
    payload: {
      ensName,
      address
    }
  };
}
