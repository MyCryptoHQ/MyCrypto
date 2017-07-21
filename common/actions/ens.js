// @flow

export type ResolveEnsNameAction = {
  type: 'ENS_RESOLVE',
  payload: string
};

export type CacheEnsAddressAction = {
  type: 'ENS_CACHE',
  payload: {
    chainId: number,
    ensName: string,
    address: string
  }
};

export type CacheEnsRegistrarAction = {
  type: 'ENS_CACHE_REGISTRAR',
  payload: {
    chainId: number,
    tld: string,
    address: string
  }
};

export type EnsAction =
  | ResolveEnsNameAction
  | CacheEnsAddressAction
  | CacheEnsRegistrarAction;

export function resolveEnsName(name: string): ResolveEnsNameAction {
  return {
    type: 'ENS_RESOLVE',
    payload: name
  };
}

export function cacheEnsAddress(
  chainId: number,
  ensName: string,
  address: string
): CacheEnsAddressAction {
  return {
    type: 'ENS_CACHE',
    payload: {
      chainId,
      ensName,
      address
    }
  };
}

export function cacheEnsRegistrar(
  chainId: number,
  tld: string,
  address: string
): CacheEnsRegistrarAction {
  return {
    type: 'ENS_CACHE_REGISTRAR',
    payload: {
      chainId,
      tld,
      address
    }
  };
}
