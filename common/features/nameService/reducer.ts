import { combineReducers } from 'redux';

import { nameServiceDomainRequestsReducer } from './domainRequests';
import { nameServiceDomainSelectorReducer } from './domainSelector';
import * as types from './types';

export const nameServiceReducer = combineReducers<types.NameServiceState>({
  domainSelector: nameServiceDomainSelectorReducer.nameServiceDomainSelectorReducer,
  domainRequests: nameServiceDomainRequestsReducer.nameServiceRequestsReducer
});
