import * as commonTypes from '../../common/types';
import * as types from './types';

const RESOLUTION_INITIAL_STATE: types.UnstoppableResolutionState = {};

const resolveDomainRequested = (
  state: types.UnstoppableResolutionState,
  action: commonTypes.ResolveDomainRequested
): types.UnstoppableResolutionState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: commonTypes.RequestStates.pending
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainSuccess = (
  state: types.UnstoppableResolutionState,
  action: commonTypes.ResolveDomainSucceeded
): types.UnstoppableResolutionState => {
  const { domain, domainData } = action.payload;
  const nextDomain = {
    data: domainData,
    state: commonTypes.RequestStates.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainCached = (
  state: types.UnstoppableResolutionState,
  action: commonTypes.ResolveDomainCached
): types.UnstoppableResolutionState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: commonTypes.RequestStates.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainFailed = (
  state: types.UnstoppableResolutionState,
  action: commonTypes.ResolveDomainFailed
): types.UnstoppableResolutionState => {
  const { domain, error } = action.payload;
  const nextDomain = {
    error: true,
    errorMsg: error.message,
    state: commonTypes.RequestStates.failed
  };

  return { ...state, [domain]: nextDomain };
};

export function ResolutionRequestsReducer(
  state: types.UnstoppableResolutionState = RESOLUTION_INITIAL_STATE,
  action: commonTypes.ResolveDomainAction
): types.UnstoppableResolutionState {
  switch (action.type) {
    case commonTypes.UnstoppableActions.UNSTOPPABLE_DOMAIN_REQUESTED:
      return resolveDomainRequested(state, action);
    case commonTypes.UnstoppableActions.UNSTOPPABLE_DOMAIN_SUCCEEDED:
      return resolveDomainSuccess(state, action);
    case commonTypes.UnstoppableActions.UNSTOPPABLE_DOMAIN_FAILED:
      return resolveDomainFailed(state, action);
    case commonTypes.UnstoppableActions.UNSTOPPABLE_DOMAIN_CACHED:
      return resolveDomainCached(state, action);
    default:
      return state;
  }
}
