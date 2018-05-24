import {
  ENS,
  ResolveDomainRequested,
  ResolveDomainFailed,
  ResolveDomainSucceeded,
  ResolveDomainCached,
  ResolveDomainAction
} from '../types';
import { DomainRequestsState, REQUEST_STATES } from './types';

const REQUESTS_INITIAL_STATE: DomainRequestsState = {};

const resolveDomainRequested = (
  state: DomainRequestsState,
  action: ResolveDomainRequested
): DomainRequestsState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: REQUEST_STATES.pending
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainSuccess = (
  state: DomainRequestsState,
  action: ResolveDomainSucceeded
): DomainRequestsState => {
  const { domain, domainData } = action.payload;
  const nextDomain = {
    data: domainData,
    state: REQUEST_STATES.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainCached = (
  state: DomainRequestsState,
  action: ResolveDomainCached
): DomainRequestsState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: REQUEST_STATES.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainFailed = (
  state: DomainRequestsState,
  action: ResolveDomainFailed
): DomainRequestsState => {
  const { domain, error } = action.payload;
  const nextDomain = {
    error: true,
    errorMsg: error.message,
    state: REQUEST_STATES.failed
  };

  return { ...state, [domain]: nextDomain };
};

export function domainRequestsReducer(
  state: DomainRequestsState = REQUESTS_INITIAL_STATE,
  action: ResolveDomainAction
): DomainRequestsState {
  switch (action.type) {
    case ENS.RESOLVE_DOMAIN_REQUESTED:
      return resolveDomainRequested(state, action);
    case ENS.RESOLVE_DOMAIN_SUCCEEDED:
      return resolveDomainSuccess(state, action);
    case ENS.RESOLVE_DOMAIN_FAILED:
      return resolveDomainFailed(state, action);
    case ENS.RESOLVE_DOMAIN_CACHED:
      return resolveDomainCached(state, action);
    default:
      return state;
  }
}
