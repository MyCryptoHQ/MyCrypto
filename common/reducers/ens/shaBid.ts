import { ShaBidRequested, ShaBidAction, ShaBidSucceeded, ShaBidFailed } from 'actions/ens';
import { TypeKeys } from 'actions/ens/constants';
import BN from 'bn.js';

export interface State {
  nameHash: string;
  bidAddress: string;
  amountWei: BN;
  secretHash: string;
  sealedBid: string;
  error: any;
}

const INITIAL_STATE: State = {
  nameHash: '',
  bidAddress: '',
  amountWei: new BN(''),
  secretHash: '',
  sealedBid: '',
  error: null
};

const shaBidRequested = (state: State, action: ShaBidRequested): State => {
  return { ...state, ...action.payload };
};

const shaBidSucceeded = (state: State, action: ShaBidSucceeded): State => {
  const { sealedBid } = action.payload;

  return { ...state, sealedBid };
};

const shaBidFailed = (state: State, action: ShaBidFailed): State => {
  return { ...state, ...action.payload };
};

export default (state: State = INITIAL_STATE, action: ShaBidAction): State => {
  switch (action.type) {
    case TypeKeys.ENS_SHA_BID_REQUESTED:
      return shaBidRequested(state, action);
    case TypeKeys.ENS_SHA_BID_SUCCEEDED:
      return shaBidSucceeded(state, action);
    case TypeKeys.ENS_SHA_BID_FAILED:
      return shaBidFailed(state, action);
    default:
      return state;
  }
};
