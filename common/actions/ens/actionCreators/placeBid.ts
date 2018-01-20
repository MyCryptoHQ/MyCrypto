import * as ActionTypes from '../actionTypes';
import { TypeKeys } from '../constants';

export type TPlaceBidRequested = typeof placeBidRequested;
export const placeBidRequested = (): ActionTypes.BidPlaceRequested => ({
  type: TypeKeys.ENS_BID_PLACE_REQUESTED
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
