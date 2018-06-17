import { DomainRequest } from 'libs/ens';
import * as types from './types';

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
