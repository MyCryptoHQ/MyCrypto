import { DomainRequest } from 'libs/ens';
import * as types from '../common/types';

export type TResolveDomainRequested = typeof resolveDomainRequested;
export const resolveDomainRequested = (
  domain: string,
  unstoppable: boolean = false
): types.ResolveDomainRequested => ({
  type: unstoppable
    ? types.UnstoppableActions.UNSTOPPABLE_DOMAIN_REQUESTED
    : types.DomainActions.RESOLVE_DOMAIN_REQUESTED,
  payload: { domain }
});

export const resolveDomainCached = (
  payload: types.ResolveDomainCached['payload'],
  unstoppable: boolean = false
): types.ResolveDomainCached => ({
  type: unstoppable
    ? types.UnstoppableActions.UNSTOPPABLE_DOMAIN_CACHED
    : types.DomainActions.RESOLVE_DOMAIN_CACHED,
  payload
});

export type TResolveDomainSucceeded = typeof resolveDomainSucceeded;
export const resolveDomainSucceeded = (
  domain: string,
  domainData: DomainRequest,
  unstoppable: boolean = false
): types.ResolveDomainSucceeded => ({
  type: unstoppable
    ? types.UnstoppableActions.UNSTOPPABLE_DOMAIN_SUCCEEDED
    : types.DomainActions.RESOLVE_DOMAIN_SUCCEEDED,
  payload: { domain, domainData }
});

export type TResolveDomainFailed = typeof resolveDomainFailed;
export const resolveDomainFailed = (
  domain: string,
  error: Error,
  unstoppable: boolean = false
): types.ResolveDomainFailed => ({
  type: unstoppable
    ? types.UnstoppableActions.UNSTOPPABLE_DOMAIN_FAILED
    : types.DomainActions.RESOLVE_DOMAIN_FAILED,
  payload: { domain, error }
});
