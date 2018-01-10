import * as ActionTypes from '../actionTypes';
import { TypeKeys } from '../constants';

export type TPlaceBidRequested = typeof placeBidRequested;
export const placeBidRequested = (bidValue, maskValue, secret): ActionTypes.BidPlaceRequested => ({
  type: TypeKeys.ENS_BID_PLACE_REQUESTED,
  payload: {
    bidValue,
    maskValue,
    secret
  }
});

export type TPlaceBidSucceeded = typeof placeBidSucceeded;
export const placeBidSucceeded = (): ActionTypes.BidPlaceSucceeded => ({
  type: TypeKeys.ENS_BID_PLACE_SUCCEEDED,
  payload: {}
});

export type TPlaceBidFailed = typeof placeBidFailed;
export const placeBidFailed = (): ActionTypes.BidPlaceFailed => ({
  type: TypeKeys.ENS_BID_PLACE_FAILED,
  payload: {}
});
