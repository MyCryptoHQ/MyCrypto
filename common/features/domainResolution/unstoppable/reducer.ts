import { combineReducers } from 'redux';
import { unstoppableResolutionReducer } from './resolution';
import { unstoppableDomainSelectorReducer } from './domainSelector';
import * as types from './types';

export const UnstoppableReducer = combineReducers<types.UnstoppableState>({
  domainSelector: unstoppableDomainSelectorReducer.DomainSelectorReducer,
  domainRequests: unstoppableResolutionReducer.ResolutionRequestsReducer
});
