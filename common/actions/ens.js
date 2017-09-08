// @flow

/*** Cache ENS address ***/
export type CacheEnsAddress = {
  type: 'ENS_CACHE',
  payload: {
    ensName: string,
    address: string
  }
};

export function cacheEnsAddress(
  ensName: string,
  address: string
): CacheEnsAddress {
  return {
    type: 'ENS_CACHE',
    payload: {
      ensName,
      address
    }
  };
}

/*** Resolve Domain ***/
export type ResolveDomainRequested = {
  type: 'ENS_RESOLVE_DOMAIN_REQUESTED',
  payload: { domain: string }
};

export const resolveDomainRequested = (
  domain: string
): ResolveDomainRequested => ({
  type: 'ENS_RESOLVE_DOMAIN_REQUESTED',
  payload: { domain }
});

/*** Resolve Domain ***/
export type ResolveDomainSuccess = {
  type: 'ENS_RESOLVE_DOMAIN_SUCCESS',
  payload: { domain: string, domainData: any }
};

export const resolveDomainSuccess = (
  domain: string,
  domainData: any
): ResolveDomainSuccess => ({
  type: 'ENS_RESOLVE_DOMAIN_SUCCESS',
  payload: { domain, domainData }
});

/*** Resolve Domain ***/
export type ResolveDomainFailed = {
  type: 'ENS_RESOLVE_DOMAIN_FAILED',
  payload: { domain: string }
};

export const resolveDomainFailed = (domain: string): ResolveDomainFailed => ({
  type: 'ENS_RESOLVE_DOMAIN_FAILED',
  payload: { domain }
});
/*** Union Type ***/
export type EnsAction =
  | ResolveDomainRequested
  | ResolveDomainSuccess
  | ResolveDomainFailed
  | CacheEnsAddress;
