import { AppState } from 'reducers';
import { IOwnedDomainRequest, IBaseDomainRequest } from 'libs/ens';
import { REQUEST_STATES } from 'reducers/ens/domainRequests';

export const getEns = (state: AppState) => state.ens;

export const getCurrentDomainName = (state: AppState) => getEns(state).domainSelector.currentDomain;

export const getDomainRequests = (state: AppState) => getEns(state).domainRequests;

export const getCurrentDomainData = (state: AppState) => {
  const currentDomain = getCurrentDomainName(state);
  const domainRequests = getDomainRequests(state);

  if (!currentDomain || !domainRequests[currentDomain] || domainRequests[currentDomain].error) {
    return null;
  }

  const domainData = domainRequests[currentDomain].data || null;

  return domainData;
};

export const getResolvedAddress = (state: AppState) => {
  const data = getCurrentDomainData(state);
  if (!data) {
    return null;
  }

  if (isOwned(data)) {
    return data.resolvedAddress;
  }
  return null;
};

export const getResolvingDomain = (state: AppState) => {
  const currentDomain = getCurrentDomainName(state);
  const domainRequests = getDomainRequests(state);

  if (!currentDomain || !domainRequests[currentDomain]) {
    return null;
  }

  return domainRequests[currentDomain].state === REQUEST_STATES.pending;
};

const isOwned = (data: IBaseDomainRequest): data is IOwnedDomainRequest => {
  return !!(data as IOwnedDomainRequest).ownerAddress;
};
