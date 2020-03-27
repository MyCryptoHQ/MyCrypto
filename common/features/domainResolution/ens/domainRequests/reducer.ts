import * as commonTypes from '../../common/types';
import * as types from './types';

const REQUESTS_INITIAL_STATE: types.ENSDomainRequestsState = {};

const resolveDomainRequested = (
  state: types.ENSDomainRequestsState,
  action: commonTypes.ResolveDomainRequested
): types.ENSDomainRequestsState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: commonTypes.RequestStates.pending
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainSuccess = (
  state: types.ENSDomainRequestsState,
  action: commonTypes.ResolveDomainSucceeded
): types.ENSDomainRequestsState => {
  const { domain, domainData } = action.payload;
  const nextDomain = {
    data: domainData,
    state: commonTypes.RequestStates.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainCached = (
  state: types.ENSDomainRequestsState,
  action: commonTypes.ResolveDomainCached
): types.ENSDomainRequestsState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: commonTypes.RequestStates.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainFailed = (
  state: types.ENSDomainRequestsState,
  action: commonTypes.ResolveDomainFailed
): types.ENSDomainRequestsState => {
  const { domain, error } = action.payload;
  const nextDomain = {
    error: true,
    errorMsg: error.message,
    state: commonTypes.RequestStates.failed
  };

  return { ...state, [domain]: nextDomain };
};

export function ensDomainRequestsReducer(
  state: types.ENSDomainRequestsState = REQUESTS_INITIAL_STATE,
  action: commonTypes.ResolveDomainAction
): types.ENSDomainRequestsState {
  switch (action.type) {
    case commonTypes.DomainActions.RESOLVE_DOMAIN_REQUESTED:
      return resolveDomainRequested(state, action);
    case commonTypes.DomainActions.RESOLVE_DOMAIN_SUCCEEDED:
      return resolveDomainSuccess(state, action);
    case commonTypes.DomainActions.RESOLVE_DOMAIN_FAILED:
      return resolveDomainFailed(state, action);
    case commonTypes.DomainActions.RESOLVE_DOMAIN_CACHED:
      return resolveDomainCached(state, action);
    default:
      return state;
  }
}
