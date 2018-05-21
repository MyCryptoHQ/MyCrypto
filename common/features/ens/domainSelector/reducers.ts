import {
  TypeKeys,
  EnsAction,
  ResolveDomainRequested,
  ResolveDomainSucceeded,
  ResolveDomainCached
} from '../types';

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

export default function domainSelector(
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
