import { combineReducers } from 'redux';

import domainRequests, { RequestsState } from './domainRequests/reducers';
import domainSelector, { SelectorState } from './domainSelector/reducers';

export interface State {
  domainSelector: SelectorState;
  domainRequests: RequestsState;
}

export default combineReducers<State>({ domainSelector, domainRequests });
