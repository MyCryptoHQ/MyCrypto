import * as ActionTypes from './actionTypes';
import { TypeKeys } from './constants';
import { DomainRequest } from 'libs/ens';

export type TResolveDomainRequested = typeof resolveDomainRequested;
export const resolveDomainRequested = (domain: string): ActionTypes.ResolveDomainRequested => ({
  type: TypeKeys.ENS_RESOLVE_DOMAIN_REQUESTED,
  payload: { domain }
});

export type TResolveDomainSucceeded = typeof resolveDomainSucceeded;
export const resolveDomainSucceeded = (
  domain: string,
  domainData: DomainRequest
): ActionTypes.ResolveDomainSucceeded => ({
  type: TypeKeys.ENS_RESOLVE_DOMAIN_SUCCEEDED,
  payload: { domain, domainData }
});

export type TResolveDomainFailed = typeof resolveDomainFailed;
export const resolveDomainFailed = (
  domain: string,
  error: Error
): ActionTypes.ResolveDomainFailed => ({
  type: TypeKeys.ENS_RESOLVE_DOMAIN_FAILED,
  payload: { domain, error }
});

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
