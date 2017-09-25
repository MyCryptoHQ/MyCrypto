import * as interfaces from './actionTypes';
import * as constants from './constants';

export function resolveEnsName(name: string): interfaces.ResolveEnsNameAction {
  return {
    type: constants.ENS_RESOLVE,
    payload: name
  };
}

export function cacheEnsAddress(
  ensName: string,
  address: string
): interfaces.CacheEnsAddressAction {
  return {
    type: constants.ENS_CACHE,
    payload: {
      ensName,
      address
    }
  };
}
