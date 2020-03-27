import { IOwnedDomainRequest, IBaseDomainRequest } from 'libs/ens';
import { isCreationAddress } from 'libs/validators';
import { AppState } from 'features/reducers';
import * as commonTypes from '../common/types';
import { ensDomainRequestsSelectors } from './domainRequests';
import { ensDomainSelectorSelectors } from './domainSelector';
import { getNetworkChainId } from 'features/config/selectors';
import { getENSTLDForChain, getENSAddressesForChain } from 'libs/ens/networkConfigs';
import { unstoppableDomainSelectorSelectors, unstoppableResolutionSelectors } from '../unstoppable';

const isOwned = (data: IBaseDomainRequest): data is IOwnedDomainRequest => {
  return !!(data as IOwnedDomainRequest).ownerAddress;
};

const hasResolvedAddress = (data: IBaseDomainRequest): data is IOwnedDomainRequest => {
  return !!(data as IOwnedDomainRequest).resolvedAddress;
};

export const getEns = (state: AppState) => state.ens;

export const getCurrentDomainData = (state: AppState) => {
  const currentDomain = ensDomainSelectorSelectors.getCurrentDomainName(state);
  const domainRequests = ensDomainRequestsSelectors.getDomainRequests(state);

  if (!currentDomain || !domainRequests[currentDomain] || domainRequests[currentDomain].error) {
    return null;
  }

  const domainData = domainRequests[currentDomain].data || null;

  return domainData;
};

export const getResolvedAddress = (state: AppState, noGenesisAddress: boolean = false) => {
  const data = getCurrentDomainData(state);
  if (!data) {
    return null;
  }

  if (isOwned(data) || hasResolvedAddress(data)) {
    const { resolvedAddress } = data;
    if (noGenesisAddress) {
      return !isCreationAddress(resolvedAddress) ? resolvedAddress : null;
    }
    return data.resolvedAddress;
  }
  return null;
};

export const getResolvingDomain = (state: AppState) => {
  const currentDomain = ensDomainSelectorSelectors.getCurrentDomainName(state);
  const domainRequests = ensDomainRequestsSelectors.getDomainRequests(state);
  const unstoppableDomain = unstoppableDomainSelectorSelectors.getCurrentDomainName(state);
  const unstoppableRequests = unstoppableResolutionSelectors.getUnstoppableRequests(state);
  let ensStatus;
  let unstoppableStatus;
  console.log({ currentDomain, unstoppableDomain });
  if (!currentDomain || !domainRequests[currentDomain]) {
    if (!unstoppableDomain || !unstoppableRequests[unstoppableDomain]) {
      return null;
    }
  }

  if (currentDomain && domainRequests[currentDomain]) {
    ensStatus = domainRequests[currentDomain].state === commonTypes.RequestStates.pending;
  }

  if (unstoppableDomain && unstoppableRequests[unstoppableDomain]) {
    unstoppableStatus =
      unstoppableRequests[unstoppableDomain].state === commonTypes.RequestStates.pending;
  }
  return ensStatus || unstoppableStatus;
};

export const getENSTLD = (state: AppState) => {
  const chainId = getNetworkChainId(state);
  return getENSTLDForChain(chainId);
};

export const getENSAddresses = (state: AppState) => {
  const chainId = getNetworkChainId(state);
  return getENSAddressesForChain(chainId);
};
