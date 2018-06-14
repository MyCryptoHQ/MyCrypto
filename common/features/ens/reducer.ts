import { combineReducers } from 'redux';

import { domainRequestsReducer } from './domainRequests/reducer';
import { domainSelectorReducer } from './domainSelector/reducer';
import { ENSState } from './types';

export const ensReducer = combineReducers<ENSState>({
  domainSelector: domainSelectorReducer,
  domainRequests: domainRequestsReducer
});
