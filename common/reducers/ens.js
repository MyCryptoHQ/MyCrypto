// @flow
import type {
  EnsAction,
  CacheEnsAddressAction,
  CacheEnsRegistrarAction
} from 'actions/ens';

type Map = { [string]: string };

type ChainState = {
  // tld -> registrar address
  tlds: Map,
  // ens name -> eth address
  names: Map
};

export type State = { [number]: ChainState };

const initialState: State = {};

function updateMap(map = {}, key, value): Map {
  return { ...map, [key]: value };
}

function cacheEnsAddress(
  state: ChainState = { names: {}, tlds: {} },
  action: CacheEnsAddressAction
): ChainState {
  const { ensName, address } = action.payload;
  return { ...state, names: updateMap(state.names, ensName, address) };
}

function cacheEnsRegistrar(
  state: ChainState = { names: {}, tlds: {} },
  action: CacheEnsRegistrarAction
): ChainState {
  const { tld, address } = action.payload;
  return { ...state, tlds: updateMap(state.tlds, tld, address) };
}

export function ens(state: State = initialState, action: EnsAction): State {
  switch (action.type) {
    case 'ENS_CACHE':
      return {
        ...state,
        [action.payload.chainId]: cacheEnsAddress(
          state[action.payload.chainId],
          action
        )
      };
    case 'ENS_CACHE_REGISTRAR':
      return {
        ...state,
        [action.payload.chainId]: cacheEnsRegistrar(
          state[action.payload.chainId],
          action
        )
      };
    default:
      return state;
  }
}
