import { combineReducers } from 'redux';

import { domainRequestsReducer, DomainRequestsState } from './domainRequests';
import { domainSelectorReducer, DomainSelectorState } from './domainSelector';

export interface ENSState {
  domainSelector: DomainSelectorState;
  domainRequests: DomainRequestsState;
}

export const ensReducer = combineReducers<ENSState>({
  domainSelector: domainSelectorReducer,
  domainRequests: domainRequestsReducer
});
