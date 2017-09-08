// @flow
import type {
  EnsAction,
  CacheEnsAddress,
  ResolveDomainRequested,
  ResolveDomainFailed,
  ResolveDomainSuccess
} from 'actions/ens';

export type State = { [string]: string };

export const INITIAL_STATE: State = {};

function cacheEnsAddress(state: State, action: CacheEnsAddress): State {
  const { ensName, address } = action.payload;
  return { ...state, [ensName]: address };
}
function resolveDomainRequested(
  state: State,
  action: ResolveDomainRequested
): State {
  const { domain } = action.payload;
  return { ...state, [domain]: { pending: true } };
}

function resolveDomainSuccess(
  state: State,
  action: ResolveDomainSuccess
): State {
  const { domain, domainData } = action.payload;
  return { ...state, [domain]: domainData };
}

export function ens(state: State = INITIAL_STATE, action: EnsAction): State {
  switch (action.type) {
    case 'ENS_CACHE':
      return cacheEnsAddress(state, action);
    case 'ENS_RESOLVE_DOMAIN_REQUESTED':
      return resolveDomainRequested(state, action);
    case 'ENS_RESOLVE_DOMAIN_SUCCESS':
      return resolveDomainSuccess(state, action);
    default:
      return state;
  }
}
