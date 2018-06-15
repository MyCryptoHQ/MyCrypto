import * as ensTypes from '../types';
import * as ensDomainRequestsTypes from './types';

const REQUESTS_INITIAL_STATE: ensDomainRequestsTypes.ENSDomainRequestsState = {};

const resolveDomainRequested = (
  state: ensDomainRequestsTypes.ENSDomainRequestsState,
  action: ensTypes.ResolveDomainRequested
): ensDomainRequestsTypes.ENSDomainRequestsState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: ensDomainRequestsTypes.RequestStates.pending
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainSuccess = (
  state: ensDomainRequestsTypes.ENSDomainRequestsState,
  action: ensTypes.ResolveDomainSucceeded
): ensDomainRequestsTypes.ENSDomainRequestsState => {
  const { domain, domainData } = action.payload;
  const nextDomain = {
    data: domainData,
    state: ensDomainRequestsTypes.RequestStates.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainCached = (
  state: ensDomainRequestsTypes.ENSDomainRequestsState,
  action: ensTypes.ResolveDomainCached
): ensDomainRequestsTypes.ENSDomainRequestsState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: ensDomainRequestsTypes.RequestStates.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainFailed = (
  state: ensDomainRequestsTypes.ENSDomainRequestsState,
  action: ensTypes.ResolveDomainFailed
): ensDomainRequestsTypes.ENSDomainRequestsState => {
  const { domain, error } = action.payload;
  const nextDomain = {
    error: true,
    errorMsg: error.message,
    state: ensDomainRequestsTypes.RequestStates.failed
  };

  return { ...state, [domain]: nextDomain };
};

export function ensDomainRequestsReducer(
  state: ensDomainRequestsTypes.ENSDomainRequestsState = REQUESTS_INITIAL_STATE,
  action: ensTypes.ResolveDomainAction
): ensDomainRequestsTypes.ENSDomainRequestsState {
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
