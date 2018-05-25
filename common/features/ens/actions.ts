import { DomainRequest } from 'libs/ens';
import {
  ENS,
  ResolveDomainRequested,
  ResolveDomainSucceeded,
  ResolveDomainFailed,
  ResolveDomainCached
} from './types';

export type TResolveDomainRequested = typeof resolveDomainRequested;
export const resolveDomainRequested = (domain: string): ResolveDomainRequested => ({
  type: ENS.RESOLVE_DOMAIN_REQUESTED,
  payload: { domain }
});

export const resolveDomainCached = (
  payload: ResolveDomainCached['payload']
): ResolveDomainCached => ({
  type: ENS.RESOLVE_DOMAIN_CACHED,
  payload
});

export type TResolveDomainSucceeded = typeof resolveDomainSucceeded;
export const resolveDomainSucceeded = (
  domain: string,
  domainData: DomainRequest
): ResolveDomainSucceeded => ({
  type: ENS.RESOLVE_DOMAIN_SUCCEEDED,
  payload: { domain, domainData }
});

export type TResolveDomainFailed = typeof resolveDomainFailed;
export const resolveDomainFailed = (domain: string, error: Error): ResolveDomainFailed => ({
  type: ENS.RESOLVE_DOMAIN_FAILED,
  payload: { domain, error }
});
