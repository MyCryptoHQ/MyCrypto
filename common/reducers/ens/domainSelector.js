// @flow
import type { EnsAction, ResolveDomainSuccess } from 'actions/ens';
import type { State } from './types';

const INITIAL_STATE: State = {};

const currentDomainName = (
  state: State,
  action: ResolveDomainSuccess
): State => {
  const { domain: domainName } = action.payload;
  return { currentDomain: domainName };
};

export default (state: State = INITIAL_STATE, action: EnsAction): State => {
  switch (action.type) {
    case 'ENS_RESOLVE_DOMAIN_SUCCESS':
      return currentDomainName(state, action);
    default:
      return state;
  }
};
