import { DomainRequest } from 'libs/ens';
import { ensDomainRequestsTypes } from './domainRequests';
import { ensDomainSelectorTypes } from './domainSelector';

export interface ENSState {
  domainRequests: ensDomainRequestsTypes.ENSDomainRequestsState;
  domainSelector: ensDomainSelectorTypes.ENSDomainSelectorState;
}

export enum ENSActions {
  RESOLVE_DOMAIN_REQUESTED = 'ENS_RESOLVE_DOMAIN_REQUESTED',
  RESOLVE_DOMAIN_SUCCEEDED = 'ENS_RESOLVE_DOMAIN_SUCCEEDED',
  RESOLVE_DOMAIN_FAILED = 'ENS_RESOLVE_DOMAIN_FAILED',
  RESOLVE_DOMAIN_CACHED = 'ENS_RESOLVE_DOMAIN_CACHED'
}

export interface ResolveDomainRequested {
  type: ENSActions.RESOLVE_DOMAIN_REQUESTED;
  payload: { domain: string };
}

export interface ResolveDomainSucceeded {
  type: ENSActions.RESOLVE_DOMAIN_SUCCEEDED;
  payload: { domain: string; domainData: DomainRequest };
}

export interface ResolveDomainCached {
  type: ENSActions.RESOLVE_DOMAIN_CACHED;
  payload: { domain: string };
}

export interface ResolveDomainFailed {
  type: ENSActions.RESOLVE_DOMAIN_FAILED;
  payload: { domain: string; error: Error };
}

export type ResolveDomainAction =
  | ResolveDomainRequested
  | ResolveDomainSucceeded
  | ResolveDomainFailed
  | ResolveDomainCached;

export type EnsAction = ResolveDomainAction;
