import { DomainRequest } from 'libs/ens';
import * as types from './types';
import BN from 'bn.js';

export type TResolveDomainRequested = typeof resolveDomainRequested;
export const resolveDomainRequested = (domain: string): types.ResolveDomainRequested => ({
  type: types.ENSActions.RESOLVE_DOMAIN_REQUESTED,
  payload: { domain }
});

export const resolveDomainCached = (
  payload: types.ResolveDomainCached['payload']
): types.ResolveDomainCached => ({
  type: types.ENSActions.RESOLVE_DOMAIN_CACHED,
  payload
});

export type TResolveDomainSucceeded = typeof resolveDomainSucceeded;
export const resolveDomainSucceeded = (
  domain: string,
  domainData: DomainRequest
): types.ResolveDomainSucceeded => ({
  type: types.ENSActions.RESOLVE_DOMAIN_SUCCEEDED,
  payload: { domain, domainData }
});

export type TResolveDomainFailed = typeof resolveDomainFailed;
export const resolveDomainFailed = (domain: string, error: Error): types.ResolveDomainFailed => ({
  type: types.ENSActions.RESOLVE_DOMAIN_FAILED,
  payload: { domain, error }
});

export type TShaBidRequested = typeof shaBidRequested;
export const shaBidRequested = (
  nameHash: string,
  bidAddress: string,
  amountWei: BN,
  secretHash: string,
  loading: boolean
): types.ShaBidRequested => ({
  type: types.ENSActions.ENS_SHA_BID_REQUESTED,
  payload: { nameHash, bidAddress, amountWei, secretHash, loading }
});

export type TShaBidSucceeded = typeof shaBidSucceeded;
export const shaBidSucceeded = (sealedBid: string, loading: boolean): types.ShaBidSucceeded => ({
  type: types.ENSActions.ENS_SHA_BID_SUCCEEDED,
  payload: { sealedBid, loading }
});

export type TShaBidFailed = typeof shaBidFailed;
export const shaBidFailed = (error: any, loading: boolean): types.ShaBidFailed => ({
  type: types.ENSActions.ENS_SHA_BID_FAILED,
  payload: { error, loading }
});
