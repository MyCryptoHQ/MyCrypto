// @flow
import type { EnsAction, CacheEnsAddressAction } from 'actions/ens';

export type State = { [string]: string };

const initialState: State = {};

function cacheEnsAddress(state: State, action: CacheEnsAddressAction): State {
  const { ensName, address } = action.payload;
  return { ...state, [ensName]: address };
}

export function ens(state: State = initialState, action: EnsAction): State {
  switch (action.type) {
    case 'ENS_CACHE':
      return cacheEnsAddress(state, action);
    default:
      return state;
  }
}
