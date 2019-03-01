import { IENSOwnedDomainRequest, IENSBaseDomainRequest } from 'libs/nameServices/ens';
import { isCreationAddress } from 'libs/validators';
import { AppState } from 'features/reducers';
import {
  nameServiceDomainRequestsTypes,
  nameServiceDomainRequestsSelectors
} from './domainRequests';
import { nameServiceDomainSelectorSelectors } from './domainSelector';
import { getNetworkChainId } from 'features/config/selectors';
import { getENSTLDForChain, getENSAddressesForChain } from 'libs/nameServices/ens/networkConfigs';

const isOwned = (data: IENSBaseDomainRequest): data is IENSOwnedDomainRequest => {
  return !!(data as IENSOwnedDomainRequest).ownerAddress;
};

export const getEns = (state: AppState) => state.nameService;

export const getCurrentDomainData = (state: AppState) => {
  const currentDomain = nameServiceDomainSelectorSelectors.getCurrentDomainName(state);
  const domainRequests = nameServiceDomainRequestsSelectors.getDomainRequests(state);

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
  const currentDomain = nameServiceDomainSelectorSelectors.getCurrentDomainName(state);
  const domainRequests = nameServiceDomainRequestsSelectors.getDomainRequests(state);

  if (!currentDomain || !domainRequests[currentDomain]) {
    return null;
  }

  return (
    domainRequests[currentDomain].state === nameServiceDomainRequestsTypes.RequestStates.pending
  );
};

export const getENSTLD = (state: AppState) => {
  const chainId = getNetworkChainId(state);
  return getENSTLDForChain(chainId);
};

export const getENSAddresses = (state: AppState) => {
  const chainId = getNetworkChainId(state);
  return getENSAddressesForChain(chainId);
};
