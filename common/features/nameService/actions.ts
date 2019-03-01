import { ENSDomainRequest } from 'libs/nameServices/ens';
import * as types from './types';

export type TResolveDomainRequested = typeof resolveDomainRequested;
export const resolveDomainRequested = (domain: string): types.ResolveDomainRequested => ({
  type: types.NameServiceActions.RESOLVE_DOMAIN_REQUESTED,
  payload: { domain }
});

export const resolveDomainCached = (
  payload: types.ResolveDomainCached['payload']
): types.ResolveDomainCached => ({
  type: types.NameServiceActions.RESOLVE_DOMAIN_CACHED,
  payload
});

export type TResolveDomainSucceeded = typeof resolveDomainSucceeded;
export const resolveDomainSucceeded = (
  domain: string,
  domainData: ENSDomainRequest
): types.ResolveDomainSucceeded => ({
  type: types.NameServiceActions.RESOLVE_DOMAIN_SUCCEEDED,
  payload: { domain, domainData }
});

export type TResolveDomainFailed = typeof resolveDomainFailed;
export const resolveDomainFailed = (domain: string, error: Error): types.ResolveDomainFailed => ({
  type: types.NameServiceActions.RESOLVE_DOMAIN_FAILED,
  payload: { domain, error }
});
