import { ENSDomainRequest } from 'libs/nameServices/ens';
import { nameServiceDomainRequestsTypes } from './domainRequests';
import { nameServiceDomainSelectorTypes } from './domainSelector';

export interface NameServiceState {
  domainRequests: nameServiceDomainRequestsTypes.NameServiceDomainRequestsState;
  domainSelector: nameServiceDomainSelectorTypes.NameServiceDomainSelectorState;
}

export enum NameServiceActions {
  RESOLVE_DOMAIN_REQUESTED = 'NAME_SERVICE_RESOLVE_DOMAIN_REQUESTED',
  RESOLVE_DOMAIN_SUCCEEDED = 'NAME_SERVICE_RESOLVE_DOMAIN_SUCCEEDED',
  RESOLVE_DOMAIN_FAILED = 'NAME_SERVICE_RESOLVE_DOMAIN_FAILED',
  RESOLVE_DOMAIN_CACHED = 'NAME_SERVICE_RESOLVE_DOMAIN_CACHED'
}

export interface ResolveDomainRequested {
  type: NameServiceActions.RESOLVE_DOMAIN_REQUESTED;
  payload: { domain: string };
}

export interface ResolveDomainSucceeded {
  type: NameServiceActions.RESOLVE_DOMAIN_SUCCEEDED;
  payload: { domain: string; domainData: ENSDomainRequest };
}

export interface ResolveDomainCached {
  type: NameServiceActions.RESOLVE_DOMAIN_CACHED;
  payload: { domain: string };
}

export interface ResolveDomainFailed {
  type: NameServiceActions.RESOLVE_DOMAIN_FAILED;
  payload: { domain: string; error: Error };
}

export type ResolveDomainAction =
  | ResolveDomainRequested
  | ResolveDomainSucceeded
  | ResolveDomainFailed
  | ResolveDomainCached;

export type NameServiceAction = ResolveDomainAction;
