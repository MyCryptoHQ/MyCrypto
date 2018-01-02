import { TypeKeys } from './constants';
import { DomainRequest } from 'libs/ens';

export interface ResolveDomainRequested {
  type: TypeKeys.ENS_RESOLVE_DOMAIN_REQUESTED;
  payload: { domain: string };
}

export interface ResolveDomainSucceeded {
  type: TypeKeys.ENS_RESOLVE_DOMAIN_SUCCEEDED;
  payload: { domain: string; domainData: DomainRequest };
}

export interface ResolveDomainFailed {
  type: TypeKeys.ENS_RESOLVE_DOMAIN_FAILED;
  payload: { domain: string; error: Error };
}

export type EnsAction = ResolveDomainRequested | ResolveDomainSucceeded | ResolveDomainFailed;
