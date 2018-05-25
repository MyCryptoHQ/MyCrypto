import { DomainRequest } from 'libs/ens';

export enum ENS {
  RESOLVE_DOMAIN_REQUESTED = 'ENS_RESOLVE_DOMAIN_REQUESTED',
  RESOLVE_DOMAIN_SUCCEEDED = 'ENS_RESOLVE_DOMAIN_SUCCEEDED',
  RESOLVE_DOMAIN_FAILED = 'ENS_RESOLVE_DOMAIN_FAILED',
  RESOLVE_DOMAIN_CACHED = 'ENS_RESOLVE_DOMAIN_CACHED'
}

export interface ResolveDomainRequested {
  type: ENS.RESOLVE_DOMAIN_REQUESTED;
  payload: { domain: string };
}

export interface ResolveDomainSucceeded {
  type: ENS.RESOLVE_DOMAIN_SUCCEEDED;
  payload: { domain: string; domainData: DomainRequest };
}

export interface ResolveDomainCached {
  type: ENS.RESOLVE_DOMAIN_CACHED;
  payload: { domain: string };
}

export interface ResolveDomainFailed {
  type: ENS.RESOLVE_DOMAIN_FAILED;
  payload: { domain: string; error: Error };
}

export type ResolveDomainAction =
  | ResolveDomainRequested
  | ResolveDomainSucceeded
  | ResolveDomainFailed
  | ResolveDomainCached;

export type EnsAction = ResolveDomainAction;
