import { DomainRequest } from 'libs/ens';

export enum RequestStates {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED'
}

export interface DomainSelectorState {
  currentDomain: null | string;
}

export enum DomainActions {
  RESOLVE_DOMAIN_REQUESTED = 'RESOLVE_DOMAIN_REQUESTED',
  RESOLVE_DOMAIN_SUCCEEDED = 'RESOLVE_DOMAIN_SUCCEEDED',
  RESOLVE_DOMAIN_FAILED = 'RESOLVE_DOMAIN_FAILED',
  RESOLVE_DOMAIN_CACHED = 'RESOLVE_DOMAIN_CACHED'
}

export enum UnstoppableActions {
  UNSTOPPABLE_DOMAIN_REQUESTED = 'UNSTOPPABLE_DOMAIN_REQUESTED',
  UNSTOPPABLE_DOMAIN_SUCCEEDED = 'UNSTOPPABLE_DOMAIN_SUCCEEDED',
  UNSTOPPABLE_DOMAIN_FAILED = 'UNSTOPPABLE_DOMAIN_FAILED',
  UNSTOPPABLE_DOMAIN_CACHED = 'UNSTOPPABLE_DOMAIN_CACHED'
}

export interface ResolveDomainRequested {
  type: DomainActions.RESOLVE_DOMAIN_REQUESTED | UnstoppableActions.UNSTOPPABLE_DOMAIN_REQUESTED;
  payload: { domain: string };
}

export interface ResolveDomainSucceeded {
  type: DomainActions.RESOLVE_DOMAIN_SUCCEEDED | UnstoppableActions.UNSTOPPABLE_DOMAIN_SUCCEEDED;
  payload: { domain: string; domainData: DomainRequest };
}

export interface ResolveDomainCached {
  type: DomainActions.RESOLVE_DOMAIN_CACHED | UnstoppableActions.UNSTOPPABLE_DOMAIN_CACHED;
  payload: { domain: string };
}

export interface ResolveDomainFailed {
  type: DomainActions.RESOLVE_DOMAIN_FAILED | UnstoppableActions.UNSTOPPABLE_DOMAIN_FAILED;
  payload: { domain: string; error: Error };
}

export type ResolveDomainAction =
  | ResolveDomainRequested
  | ResolveDomainSucceeded
  | ResolveDomainFailed
  | ResolveDomainCached;

export type EnsAction = ResolveDomainAction;
