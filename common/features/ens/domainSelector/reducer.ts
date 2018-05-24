import {
  ENS,
  EnsAction,
  ResolveDomainRequested,
  ResolveDomainSucceeded,
  ResolveDomainCached
} from '../types';
import { DomainSelectorState } from './types';

const SELECTOR_INITIAL_STATE: DomainSelectorState = {
  currentDomain: null
};

const setCurrentDomainName = (
  state: DomainSelectorState,
  action: ResolveDomainSucceeded | ResolveDomainCached | ResolveDomainRequested
): DomainSelectorState => {
  const { domain: domainName } = action.payload;
  return { ...state, currentDomain: domainName };
};

const clearCurrentDomainName = (): DomainSelectorState => {
  return { currentDomain: null };
};

export function domainSelectorReducer(
  state: DomainSelectorState = SELECTOR_INITIAL_STATE,
  action: EnsAction
): DomainSelectorState {
  switch (action.type) {
    case ENS.RESOLVE_DOMAIN_CACHED:
    case ENS.RESOLVE_DOMAIN_REQUESTED:
    case ENS.RESOLVE_DOMAIN_SUCCEEDED:
      return setCurrentDomainName(state, action);
    case ENS.RESOLVE_DOMAIN_FAILED:
      return clearCurrentDomainName();
    default:
      return state;
  }
}
