import * as ActionTypes from '../actionTypes';
import { TypeKeys } from '../constants';
import { DomainRequest } from 'libs/ens';
import { ResolveDomainCached } from 'actions/ens';

export type TResolveDomainRequested = typeof resolveDomainRequested;
export const resolveDomainRequested = (domain: string): ActionTypes.ResolveDomainRequested => ({
  type: TypeKeys.ENS_RESOLVE_DOMAIN_REQUESTED,
  payload: { domain }
});

export const resolveDomainCached = (
  payload: ResolveDomainCached['payload']
): ResolveDomainCached => ({
  type: TypeKeys.ENS_RESOLVE_DOMAIN_CACHED,
  payload
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
