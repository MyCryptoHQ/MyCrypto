import { TypeKeys } from './constants';
import { DomainRequest } from 'libs/ens';
import { Wei } from 'libs/units';

export interface ResolveDomainRequested {
  type: TypeKeys.ENS_RESOLVE_DOMAIN_REQUESTED;
  payload: { domain: string };
}

export interface ResolveDomainSucceeded {
  type: TypeKeys.ENS_RESOLVE_DOMAIN_SUCCEEDED;
  payload: { domain: string; domainData: DomainRequest };
}

export interface ResolveDomainFailed {
  type: TypeKeys.ENS_RESOLVE_DOMAIN_FAILED;
  payload: { domain: string; error: Error };
}

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

export type EnsAction =
  | ResolveDomainRequested
  | ResolveDomainSucceeded
  | ResolveDomainFailed
  | BidPlaceRequested
  | BidPlaceSucceeded
  | BidPlaceFailed;
