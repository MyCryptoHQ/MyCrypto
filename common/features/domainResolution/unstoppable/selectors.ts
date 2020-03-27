import { AppState } from 'features/reducers';
import { unstoppableResolutionSelectors } from './resolution';
import { unstoppableDomainSelectorSelectors } from './domainSelector';

export const getCurrentDomainData = (state: AppState) => {
  const currentDomain = unstoppableDomainSelectorSelectors.getCurrentDomainName(state);
  const domainRequests = unstoppableResolutionSelectors.getUnstoppableRequests(state);

  if (!currentDomain || !domainRequests[currentDomain] || domainRequests[currentDomain].error) {
    return null;
  }

  const domainData = domainRequests[currentDomain].data || null;
  console.log({ hahah: true, domainData, domainRequests });
  return domainData;
};

export const getResolvedAddress = (state: AppState) => {
  const data = getCurrentDomainData(state);
  if (!data || !data.resolvedAddress) {
    return null;
  }
  return data.resolvedAddress;
};
