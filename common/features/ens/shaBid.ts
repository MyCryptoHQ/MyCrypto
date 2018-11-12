import * as types from './types';
import BN from 'bn.js';

export interface ShaBidState {
  nameHash: string;
  bidAddress: string;
  amountWei: BN;
  secretHash: string;
  sealedBid: string;
  error: any;
  loading: boolean;
}

const INITIAL_STATE: ShaBidState = {
  nameHash: '',
  bidAddress: '',
  amountWei: new BN(''),
  secretHash: '',
  sealedBid: '',
  error: null,
  loading: false
};

const shaBidRequested = (state: ShaBidState, action: types.ShaBidRequested): ShaBidState => {
  return { ...state, ...action.payload };
};

const shaBidSucceeded = (state: ShaBidState, action: types.ShaBidSucceeded): ShaBidState => {
  return { ...state, ...action.payload };
};

const shaBidFailed = (state: ShaBidState, action: types.ShaBidFailed): ShaBidState => {
  return { ...state, ...action.payload };
};

export default (state: ShaBidState = INITIAL_STATE, action: types.ShaBidAction): ShaBidState => {
  switch (action.type) {
    case types.ENSActions.ENS_SHA_BID_REQUESTED:
      return shaBidRequested(state, action);
    case types.ENSActions.ENS_SHA_BID_SUCCEEDED:
      return shaBidSucceeded(state, action);
    case types.ENSActions.ENS_SHA_BID_FAILED:
      return shaBidFailed(state, action);
    default:
      return state;
  }
};
