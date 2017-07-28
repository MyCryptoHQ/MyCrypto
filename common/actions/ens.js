// @flow

/*** Resolve ENS name ***/
export type ResolveEnsNameAction = {
  type: 'ENS_RESOLVE',
  payload: string
};

export function resolveEnsName(name: string): ResolveEnsNameAction {
  return {
    type: 'ENS_RESOLVE',
    payload: name
  };
}

/*** Cache ENS address ***/
export type CacheEnsAddressAction = {
  type: 'ENS_CACHE',
  payload: {
    ensName: string,
    address: string
  }
};

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

/*** Union Type ***/
export type EnsAction = ResolveEnsNameAction | CacheEnsAddressAction;
