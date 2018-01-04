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
  type: Typekeys.BidPlaceRequested;
  payload: {
    bidValue: Wei;
    maskValue: Wei;
    secret: string;
  };
}
export interface BidPlaceSucceeded {
  type: Typekeys.BidPlaceSucceeded;
  payload: {};
}
export interface BidPlaceFailed {
  type: Typekeys.BidPlaceFailed;
  payload: {};
}

export type EnsAction = ResolveDomainRequested | ResolveDomainSucceeded | ResolveDomainFailed;
