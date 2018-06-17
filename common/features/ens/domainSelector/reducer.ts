import * as ensTypes from '../types';
import * as types from './types';

const SELECTOR_INITIAL_STATE: types.ENSDomainSelectorState = {
  currentDomain: null
};

const setCurrentDomainName = (
  state: types.ENSDomainSelectorState,
  action:
    | ensTypes.ResolveDomainSucceeded
    | ensTypes.ResolveDomainCached
    | ensTypes.ResolveDomainRequested
): types.ENSDomainSelectorState => {
  const { domain: domainName } = action.payload;
  return { ...state, currentDomain: domainName };
};

const clearCurrentDomainName = (): types.ENSDomainSelectorState => {
  return { currentDomain: null };
};

export function ensDomainSelectorReducer(
  state: types.ENSDomainSelectorState = SELECTOR_INITIAL_STATE,
  action: ensTypes.EnsAction
): types.ENSDomainSelectorState {
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
