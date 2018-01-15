import domainSelector, { State as DSState } from './domainSelector';
import domainRequests, { State as DRState } from './domainRequests';

import { combineReducers } from 'redux';

export interface State {
  domainSelector: DSState;
  domainRequests: DRState;
}

export const ens = combineReducers({ domainSelector, domainRequests });
