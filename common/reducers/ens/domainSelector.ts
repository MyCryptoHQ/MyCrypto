import {
  EnsAction,
  ResolveDomainSucceeded,
  ResolveDomainCached,
  ResolveDomainRequested
} from 'actions/ens';
import { TypeKeys } from 'actions/ens/constants';

export interface State {
  currentDomain: null | string;
}

const INITIAL_STATE: State = {
  currentDomain: null
};

const setCurrentDomainName = (
  state: State,
  action: ResolveDomainSucceeded | ResolveDomainCached | ResolveDomainRequested
): State => {
  const { domain: domainName } = action.payload;
  return { ...state, currentDomain: domainName };
};

const clearCurrentDomainName = (): State => {
  return { currentDomain: null };
};

export default (state: State = INITIAL_STATE, action: EnsAction): State => {
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
};
