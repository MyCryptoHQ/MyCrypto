import * as ensTypes from '../types';
import * as types from './types';

const REQUESTS_INITIAL_STATE: types.ENSDomainRequestsState = {};

const resolveDomainRequested = (
  state: types.ENSDomainRequestsState,
  action: ensTypes.ResolveDomainRequested
): types.ENSDomainRequestsState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: types.RequestStates.pending
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainSuccess = (
  state: types.ENSDomainRequestsState,
  action: ensTypes.ResolveDomainSucceeded
): types.ENSDomainRequestsState => {
  const { domain, domainData } = action.payload;
  const nextDomain = {
    data: domainData,
    state: types.RequestStates.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainCached = (
  state: types.ENSDomainRequestsState,
  action: ensTypes.ResolveDomainCached
): types.ENSDomainRequestsState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: types.RequestStates.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainFailed = (
  state: types.ENSDomainRequestsState,
  action: ensTypes.ResolveDomainFailed
): types.ENSDomainRequestsState => {
  const { domain, error } = action.payload;
  const nextDomain = {
    error: true,
    errorMsg: error.message,
    state: types.RequestStates.failed
  };

  return { ...state, [domain]: nextDomain };
};

export function ensDomainRequestsReducer(
  state: types.ENSDomainRequestsState = REQUESTS_INITIAL_STATE,
  action: ensTypes.ResolveDomainAction
): types.ENSDomainRequestsState {
  switch (action.type) {
    case ensTypes.ENSActions.RESOLVE_DOMAIN_REQUESTED:
      return resolveDomainRequested(state, action);
    case ensTypes.ENSActions.RESOLVE_DOMAIN_SUCCEEDED:
      return resolveDomainSuccess(state, action);
    case ensTypes.ENSActions.RESOLVE_DOMAIN_FAILED:
      return resolveDomainFailed(state, action);
    case ensTypes.ENSActions.RESOLVE_DOMAIN_CACHED:
      return resolveDomainCached(state, action);
    default:
      return state;
  }
}
