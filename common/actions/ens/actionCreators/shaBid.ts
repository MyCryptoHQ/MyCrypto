import * as ActionTypes from '../actionTypes';
import { TypeKeys } from '../constants';
import BN from 'bn.js';

type TShaBidRequested = typeof shaBidRequested;
const shaBidRequested = (
  nameHash: string,
  bidAddress: string,
  amountWei: BN,
  secretHash: string
): ActionTypes.ShaBidRequested => ({
  type: TypeKeys.ENS_SHA_BID_REQUESTED,
  payload: { nameHash, bidAddress, amountWei, secretHash }
});

type TShaBidSucceeded = typeof shaBidSucceeded;
const shaBidSucceeded = (sealedBid: string): ActionTypes.ShaBidSucceeded => ({
  type: TypeKeys.ENS_SHA_BID_SUCCEEDED,
  payload: { sealedBid }
});

type TShaBidFailed = typeof shaBidFailed;
const shaBidFailed = (error: any): ActionTypes.ShaBidFailed => ({
  type: TypeKeys.ENS_SHA_BID_FAILED,
  payload: { error }
});

export {
  shaBidRequested,
  shaBidSucceeded,
  shaBidFailed,
  TShaBidRequested,
  TShaBidSucceeded,
  TShaBidFailed
};
