import { DomainRequest } from 'libs/ens';
import * as ensTypes from './types';

export type TResolveDomainRequested = typeof resolveDomainRequested;
export const resolveDomainRequested = (domain: string): ensTypes.ResolveDomainRequested => ({
  type: ensTypes.ENSActions.RESOLVE_DOMAIN_REQUESTED,
  payload: { domain }
});

export const resolveDomainCached = (
  payload: ensTypes.ResolveDomainCached['payload']
): ensTypes.ResolveDomainCached => ({
  type: ensTypes.ENSActions.RESOLVE_DOMAIN_CACHED,
  payload
});

export type TResolveDomainSucceeded = typeof resolveDomainSucceeded;
export const resolveDomainSucceeded = (
  domain: string,
  domainData: DomainRequest
): ensTypes.ResolveDomainSucceeded => ({
  type: ensTypes.ENSActions.RESOLVE_DOMAIN_SUCCEEDED,
  payload: { domain, domainData }
});

export type TResolveDomainFailed = typeof resolveDomainFailed;
export const resolveDomainFailed = (
  domain: string,
  error: Error
): ensTypes.ResolveDomainFailed => ({
  type: ensTypes.ENSActions.RESOLVE_DOMAIN_FAILED,
  payload: { domain, error }
});
