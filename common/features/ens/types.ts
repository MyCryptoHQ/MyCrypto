import { DomainRequest } from 'libs/ens';
import { ensDomainRequestsTypes } from './domainRequests';
import { ensDomainSelectorTypes } from './domainSelector';
import { ShaBidState } from './shaBid';
import BN from 'bn.js';

export interface ENSState {
  domainRequests: ensDomainRequestsTypes.ENSDomainRequestsState;
  domainSelector: ensDomainSelectorTypes.ENSDomainSelectorState;
  shaBid: ShaBidState;
}

export enum ENSActions {
  RESOLVE_DOMAIN_REQUESTED = 'ENS_RESOLVE_DOMAIN_REQUESTED',
  RESOLVE_DOMAIN_SUCCEEDED = 'ENS_RESOLVE_DOMAIN_SUCCEEDED',
  RESOLVE_DOMAIN_FAILED = 'ENS_RESOLVE_DOMAIN_FAILED',
  RESOLVE_DOMAIN_CACHED = 'ENS_RESOLVE_DOMAIN_CACHED',
  ENS_SHA_BID_REQUESTED = 'ENS_SHA_BID_REQUESTED',
  ENS_SHA_BID_SUCCEEDED = 'ENS_SHA_BID_SUCCEEDED',
  ENS_SHA_BID_FAILED = 'ENS_SHA_BID_FAILED'
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

export interface ShaBidRequested {
  type: ENSActions.ENS_SHA_BID_REQUESTED;
  payload: {
    nameHash: string;
    bidAddress: string;
    amountWei: BN;
    secretHash: string;
    loading: boolean;
  };
}

export interface ShaBidSucceeded {
  type: ENSActions.ENS_SHA_BID_SUCCEEDED;
  payload: { sealedBid: string; loading: boolean };
}

export interface ShaBidFailed {
  type: ENSActions.ENS_SHA_BID_FAILED;
  payload: { error: any; loading: boolean };
}

export type ShaBidAction = ShaBidRequested | ShaBidSucceeded | ShaBidFailed;

export type EnsAction = ResolveDomainAction | ShaBidAction;
