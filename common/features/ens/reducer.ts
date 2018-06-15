import { combineReducers } from 'redux';

import * as ensDomainRequestsReducer from './domainRequests/reducer';
import * as ensDomainSelectorReducer from './domainSelector/reducer';
import * as ensTypes from './types';

export const ensReducer = combineReducers<ensTypes.ENSState>({
  domainSelector: ensDomainSelectorReducer.ensDomainSelectorReducer,
  domainRequests: ensDomainRequestsReducer.ensDomainRequestsReducer
});
