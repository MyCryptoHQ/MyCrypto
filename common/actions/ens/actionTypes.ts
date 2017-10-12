import * as constants from './constants';
import { IResolveDomainRequest } from 'libs/ens';

export interface ResolveDomainRequested {
  type: 'ENS_RESOLVE_DOMAIN_REQUESTED';
  payload: { domain: string };
}

export interface ResolveDomainSucceeded {
  type: 'ENS_RESOLVE_DOMAIN_SUCCEEDED';
  payload: { domain: string; domainData: IResolveDomainRequest };
}

export interface ResolveDomainFailed {
  type: 'ENS_RESOLVE_DOMAIN_FAILED';
  payload: { domain: string; error: Error };
}

export type EnsAction =
  | ResolveDomainRequested
  | ResolveDomainSucceeded
  | ResolveDomainFailed;
