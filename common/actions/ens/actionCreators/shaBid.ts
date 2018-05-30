import * as ActionTypes from '../actionTypes';
import { TypeKeys } from '../constants';
import BN from 'bn.js';

type TShaBidRequested = typeof shaBidRequested;
const shaBidRequested = (
  nameHash: string,
  bidAddress: string,
  amountWei: BN,
  secretHash: string,
  loading: boolean
): ActionTypes.ShaBidRequested => ({
  type: TypeKeys.ENS_SHA_BID_REQUESTED,
  payload: { nameHash, bidAddress, amountWei, secretHash, loading }
});

type TShaBidSucceeded = typeof shaBidSucceeded;
const shaBidSucceeded = (sealedBid: string, loading: boolean): ActionTypes.ShaBidSucceeded => ({
  type: TypeKeys.ENS_SHA_BID_SUCCEEDED,
  payload: { sealedBid, loading }
});

type TShaBidFailed = typeof shaBidFailed;
const shaBidFailed = (error: any, loading: boolean): ActionTypes.ShaBidFailed => ({
  type: TypeKeys.ENS_SHA_BID_FAILED,
  payload: { error, loading }
});

export {
  shaBidRequested,
  shaBidSucceeded,
  shaBidFailed,
  TShaBidRequested,
  TShaBidSucceeded,
  TShaBidFailed
};
