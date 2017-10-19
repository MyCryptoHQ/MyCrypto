/*** Resolve ENS name ***/
export interface ResolveEnsNameAction {
  type: 'ENS_RESOLVE';
  payload: string;
}

/*** Cache ENS address ***/
export interface CacheEnsAddressAction {
  type: 'ENS_CACHE';
  payload: {
    ensName: string;
    address: string;
  };
}

/*** Union Type ***/
export type EnsAction = ResolveEnsNameAction | CacheEnsAddressAction;
