import domainSelector, { State as DSState } from './domainSelector';
import domainRequests, { State as DRState } from './domainRequests';
import bidding, { State as BiddingState } from './bidding';
import fields, { State as FieldsState } from './fields';

import { combineReducers } from 'redux';

export interface State {
  domainSelector: DSState;
  domainRequests: DRState;
  fields: FieldsState;
  bidding: BiddingState;
}

export const ens = combineReducers<State>({ domainSelector, domainRequests, fields, bidding });
