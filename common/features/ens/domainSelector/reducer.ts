import * as ensTypes from '../types';
import * as ensDomainSelectorTypes from './types';

const SELECTOR_INITIAL_STATE: ensDomainSelectorTypes.ENSDomainSelectorState = {
  currentDomain: null
};

const setCurrentDomainName = (
  state: ensDomainSelectorTypes.ENSDomainSelectorState,
  action:
    | ensTypes.ResolveDomainSucceeded
    | ensTypes.ResolveDomainCached
    | ensTypes.ResolveDomainRequested
): ensDomainSelectorTypes.ENSDomainSelectorState => {
  const { domain: domainName } = action.payload;
  return { ...state, currentDomain: domainName };
};

const clearCurrentDomainName = (): ensDomainSelectorTypes.ENSDomainSelectorState => {
  return { currentDomain: null };
};

export function ensDomainSelectorReducer(
  state: ensDomainSelectorTypes.ENSDomainSelectorState = SELECTOR_INITIAL_STATE,
  action: ensTypes.EnsAction
): ensDomainSelectorTypes.ENSDomainSelectorState {
  switch (action.type) {
    case ensTypes.ENSActions.RESOLVE_DOMAIN_CACHED:
    case ensTypes.ENSActions.RESOLVE_DOMAIN_REQUESTED:
    case ensTypes.ENSActions.RESOLVE_DOMAIN_SUCCEEDED:
      return setCurrentDomainName(state, action);
    case ensTypes.ENSActions.RESOLVE_DOMAIN_FAILED:
      return clearCurrentDomainName();
    default:
      return state;
  }
}
