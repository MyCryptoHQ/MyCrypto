import domainSelector, { State as DSState } from './domainSelector';
import domainRequests, { State as DRState } from './domainRequests';
import placeBid, { State as BidState } from './placeBid';

import { combineReducers } from 'redux';

export interface State {
  domainSelector: DSState;
  domainRequests: DRState;
  placeBid: BidState;
}

export const ens = combineReducers({ domainSelector, domainRequests, placeBid });
