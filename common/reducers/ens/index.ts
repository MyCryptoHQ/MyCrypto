import domainSelector, { State as DSState } from './domainSelector';
import domainRequests, { State as DRState } from './domainRequests';
import shaBid, { State as SBState } from './shaBid';

import { combineReducers } from 'redux';

export interface State {
  domainSelector: DSState;
  domainRequests: DRState;
  shaBid: SBState;
}

export const ens = combineReducers<State>({ domainSelector, domainRequests, shaBid });
