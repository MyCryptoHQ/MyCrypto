import { TypeKeys } from '../constants';

export interface BidPlaceRequested {
  type: TypeKeys.ENS_BID_PLACE_REQUESTED;
}
export interface BidPlaceSucceeded {
  type: TypeKeys.ENS_BID_PLACE_SUCCEEDED;
  payload: {};
}
export interface BidPlaceFailed {
  type: TypeKeys.ENS_BID_PLACE_FAILED;
  payload: {};
}

export type PlaceBidAction = BidPlaceRequested | BidPlaceSucceeded | BidPlaceFailed;
