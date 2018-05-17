import { combineReducers } from 'redux';

import { DomainRequest } from 'libs/ens';
import {
  TypeKeys,
  EnsAction,
  ResolveDomainRequested,
  ResolveDomainFailed,
  ResolveDomainSucceeded,
  ResolveDomainCached,
  ResolveDomainAction
} from './types';

//#region Domain Requests
export interface RequestsState {
  [key: string]: {
    state: REQUEST_STATES;
    data?: DomainRequest;
    error?: boolean;
    errorMsg?: string;
  };
}

const REQUESTS_INITIAL_STATE: RequestsState = {};

export enum REQUEST_STATES {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED'
}

const resolveDomainRequested = (
  state: RequestsState,
  action: ResolveDomainRequested
): RequestsState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: REQUEST_STATES.pending
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainSuccess = (
  state: RequestsState,
  action: ResolveDomainSucceeded
): RequestsState => {
  const { domain, domainData } = action.payload;
  const nextDomain = {
    data: domainData,
    state: REQUEST_STATES.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainCached = (state: RequestsState, action: ResolveDomainCached): RequestsState => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: REQUEST_STATES.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainFailed = (state: RequestsState, action: ResolveDomainFailed): RequestsState => {
  const { domain, error } = action.payload;
  const nextDomain = {
    error: true,
    errorMsg: error.message,
    state: REQUEST_STATES.failed
  };

  return { ...state, [domain]: nextDomain };
};

function domainRequests(
  state: RequestsState = REQUESTS_INITIAL_STATE,
  action: ResolveDomainAction
): RequestsState {
  switch (action.type) {
    case TypeKeys.ENS_RESOLVE_DOMAIN_REQUESTED:
      return resolveDomainRequested(state, action);
    case TypeKeys.ENS_RESOLVE_DOMAIN_SUCCEEDED:
      return resolveDomainSuccess(state, action);
    case TypeKeys.ENS_RESOLVE_DOMAIN_FAILED:
      return resolveDomainFailed(state, action);
    case TypeKeys.ENS_RESOLVE_DOMAIN_CACHED:
      return resolveDomainCached(state, action);
    default:
      return state;
  }
}
//#endregion Domain Requests

//#region Domain Selector
export interface SelectorState {
  currentDomain: null | string;
}

const SELECTOR_INITIAL_STATE: SelectorState = {
  currentDomain: null
};

const setCurrentDomainName = (
  state: SelectorState,
  action: ResolveDomainSucceeded | ResolveDomainCached | ResolveDomainRequested
): SelectorState => {
  const { domain: domainName } = action.payload;
  return { ...state, currentDomain: domainName };
};

const clearCurrentDomainName = (): SelectorState => {
  return { currentDomain: null };
};

export function domainSelector(
  state: SelectorState = SELECTOR_INITIAL_STATE,
  action: EnsAction
): SelectorState {
  switch (action.type) {
    case TypeKeys.ENS_RESOLVE_DOMAIN_CACHED:
    case TypeKeys.ENS_RESOLVE_DOMAIN_REQUESTED:
    case TypeKeys.ENS_RESOLVE_DOMAIN_SUCCEEDED:
      return setCurrentDomainName(state, action);
    case TypeKeys.ENS_RESOLVE_DOMAIN_FAILED:
      return clearCurrentDomainName();
    default:
      return state;
  }
}
//#endregion Domain Selector

export interface State {
  domainSelector: SelectorState;
  domainRequests: RequestsState;
}

export default combineReducers<State>({ domainSelector, domainRequests });
