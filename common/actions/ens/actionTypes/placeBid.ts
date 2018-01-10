import { TypeKeys } from '../constants';
import { Wei } from 'libs/units';

export interface BidPlaceRequested {
  type: TypeKeys.ENS_BID_PLACE_REQUESTED;
  payload: {
    bidValue: Wei;
    maskValue: Wei;
    secret: string;
  };
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
