import {
  EnsAction,
  ResolveDomainRequested,
  ResolveDomainFailed,
  ResolveDomainSucceeded,
  ResolveDomainCached
} from 'actions/ens';
import { DomainRequest } from 'libs/ens';
import { TypeKeys } from 'actions/ens/constants';

export interface State {
  [key: string]: {
    state: REQUEST_STATES;
    data?: DomainRequest;
    error?: boolean;
    errorMsg?: string;
  };
}

const INITIAL_STATE: State = {};

export enum REQUEST_STATES {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED'
}

const resolveDomainRequested = (state: State, action: ResolveDomainRequested): State => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: REQUEST_STATES.pending
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainSuccess = (state: State, action: ResolveDomainSucceeded): State => {
  const { domain, domainData } = action.payload;
  const nextDomain = {
    data: domainData,
    state: REQUEST_STATES.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainCached = (state: State, action: ResolveDomainCached): State => {
  const { domain } = action.payload;
  const nextDomain = {
    ...state[domain],
    state: REQUEST_STATES.success
  };

  return { ...state, [domain]: nextDomain };
};

const resolveDomainFailed = (state: State, action: ResolveDomainFailed): State => {
  const { domain, error } = action.payload;
  const nextDomain = {
    error: true,
    errorMsg: error.message,
    state: REQUEST_STATES.failed
  };

  return { ...state, [domain]: nextDomain };
};

export default (state: State = INITIAL_STATE, action: EnsAction): State => {
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
};
