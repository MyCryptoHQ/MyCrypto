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
  console.log({ domainData, domainRequests });
  return domainData;
};
