import * as commonTypes from '../../common/types';
import * as types from './types';

const SELECTOR_INITIAL_STATE: types.DomainSelectorState = {
  currentDomain: null
};

const setCurrentDomainName = (
  state: types.DomainSelectorState,
  action:
    | commonTypes.ResolveDomainSucceeded
    | commonTypes.ResolveDomainCached
    | commonTypes.ResolveDomainRequested
): types.DomainSelectorState => {
  const { domain: domainName } = action.payload;
  return { ...state, currentDomain: domainName };
};

const setResolvedAddress = (
  state: types.DomainSelectorState,
  action: commonTypes.ResolveDomainSucceeded
): types.DomainSelectorState => {
  const { domain: domainName } = action.payload;
  return { ...state, currentDomain: domainName };
};

const clearCurrentDomainName = (): types.DomainSelectorState => {
  return { currentDomain: null };
};

export function DomainSelectorReducer(
  state: types.DomainSelectorState = SELECTOR_INITIAL_STATE,
  action: commonTypes.EnsAction
): types.DomainSelectorState {
  switch (action.type) {
    case commonTypes.UnstoppableActions.UNSTOPPABLE_DOMAIN_CACHED:
    case commonTypes.UnstoppableActions.UNSTOPPABLE_DOMAIN_REQUESTED:
      return setCurrentDomainName(state, action);
    case commonTypes.UnstoppableActions.UNSTOPPABLE_DOMAIN_SUCCEEDED:
      return setResolvedAddress(state, action);
    case commonTypes.DomainActions.RESOLVE_DOMAIN_FAILED:
    case commonTypes.UnstoppableActions.UNSTOPPABLE_DOMAIN_FAILED:
      return clearCurrentDomainName();
    default:
      return state;
  }
}
