// @flow

import type { State } from './types';

const INITIAL_STATE: State = {};

import type {
  EnsAction,
  ResolveDomainRequested,
  ResolveDomainFailed,
  ResolveDomainSuccess
} from 'actions/ens';

const REQUEST_STATES = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED'
};

const resolveDomainRequested = (
  state: State,
  action: ResolveDomainRequested
): State => {
  const { domain } = action.payload;
  const prevDomain = state[domain];
  const nextDomain = { ...prevDomain, state: REQUEST_STATES.pending };
  return { ...state, [domain]: nextDomain };
};

const resolveDomainSuccess = (
  state: State,
  action: ResolveDomainSuccess
): State => {
  const { domain, domainData } = action.payload;
  const prevDomain = state[domain];
  const nextDomain = {
    ...prevDomain,
    data: domainData,
    state: REQUEST_STATES.success
  };
  return { ...state, [domain]: nextDomain };
};

const resolveDomainFailed = (
  state: State,
  action: ResolveDomainFailed
): State => {
  const { domain, error } = action.payload;
  const prevDomain = state[domain];
  const nextDomain = {
    ...prevDomain,
    data: error.message,
    state: REQUEST_STATES.failed
  };
  return { ...state, [domain]: nextDomain };
};

export default (state: State = INITIAL_STATE, action: EnsAction): State => {
  switch (action.type) {
    case 'ENS_RESOLVE_DOMAIN_REQUESTED':
      return resolveDomainRequested(state, action);
    case 'ENS_RESOLVE_DOMAIN_SUCCESS':
      return resolveDomainSuccess(state, action);
    case 'ENS_RESOLVE_DOMAIN_FAILED':
      return resolveDomainFailed(state, action);
    default:
      return state;
  }
};
