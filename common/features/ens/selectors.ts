import { IOwnedDomainRequest, IBaseDomainRequest } from 'libs/ens';
import { isCreationAddress } from 'libs/validators';
import { AppState } from 'features/reducers';
import { ensDomainRequestsTypes, ensDomainRequestsSelectors } from './domainRequests';
import { ensDomainSelectorSelectors } from './domainSelector';
import { getNetworkChainId } from 'features/config/selectors';
import { getENSTLDForChain, getENSAddressesForChain } from 'libs/ens/networkConfigs';

const isOwned = (data: IBaseDomainRequest): data is IOwnedDomainRequest => {
  return !!(data as IOwnedDomainRequest).ownerAddress;
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

  if (isOwned(data)) {
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

  if (!currentDomain || !domainRequests[currentDomain]) {
    return null;
  }

  return domainRequests[currentDomain].state === ensDomainRequestsTypes.RequestStates.pending;
};

export const getENSTLD = (state: AppState) => {
  const chainId = getNetworkChainId(state);
  return getENSTLDForChain(chainId);
};

export const getENSAddresses = (state: AppState) => {
  const chainId = getNetworkChainId(state);
  return getENSAddressesForChain(chainId);
};
