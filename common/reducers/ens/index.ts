import domainSelector, { State as DSState } from './domainSelector';
import domainRequests, { State as DRState } from './domainRequests';
import placeBid, { State as BidState } from './placeBid';
import fields, { State as FieldsState } from './fields';

import { combineReducers } from 'redux';

export interface State {
  domainSelector: DSState;
  domainRequests: DRState;
  placeBid: BidState;
  fields: FieldsState;
}

export const ens = combineReducers({ domainSelector, domainRequests, placeBid, fields });
