import * as nameServiceTypes from '../types';
import * as types from './types';

const SELECTOR_INITIAL_STATE: types.NameServiceDomainSelectorState = {
  currentDomain: null
};

const setCurrentDomainName = (
  state: types.NameServiceDomainSelectorState,
  action:
    | nameServiceTypes.ResolveDomainSucceeded
    | nameServiceTypes.ResolveDomainCached
    | nameServiceTypes.ResolveDomainRequested
): types.NameServiceDomainSelectorState => {
  const { domain: domainName } = action.payload;
  return { ...state, currentDomain: domainName };
};

const clearCurrentDomainName = (): types.NameServiceDomainSelectorState => {
  return { currentDomain: null };
};

export function nameServiceDomainSelectorReducer(
  state: types.NameServiceDomainSelectorState = SELECTOR_INITIAL_STATE,
  action: nameServiceTypes.NameServiceAction
): types.NameServiceDomainSelectorState {
  switch (action.type) {
    case nameServiceTypes.NameServiceActions.RESOLVE_DOMAIN_CACHED:
    case nameServiceTypes.NameServiceActions.RESOLVE_DOMAIN_REQUESTED:
    case nameServiceTypes.NameServiceActions.RESOLVE_DOMAIN_SUCCEEDED:
      return setCurrentDomainName(state, action);
    case nameServiceTypes.NameServiceActions.RESOLVE_DOMAIN_FAILED:
      return clearCurrentDomainName();
    default:
      return state;
  }
}
