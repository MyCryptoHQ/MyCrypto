// @flow
import type {
  EnsAction,
  ResolveDomainSuccess,
  ResolveDomainFailed
} from 'actions/ens';
import type { State } from './types';

const INITIAL_STATE: State = {};

const setCurrentDomainName = (
  state: State,
  action: ResolveDomainSuccess
): State => {
  const { domain: domainName } = action.payload;
  return { currentDomain: domainName };
};
const clearCurrentDomainName = (): State => {
  return { currentDomain: null };
};

export default (state: State = INITIAL_STATE, action: EnsAction): State => {
  switch (action.type) {
    case 'ENS_RESOLVE_DOMAIN_SUCCESS':
      return setCurrentDomainName(state, action);
    case 'ENS_RESOLVE_DOMAIN_FAILED':
      return clearCurrentDomainName();
    default:
      return state;
  }
};
