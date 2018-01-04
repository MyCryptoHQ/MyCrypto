import { AppState } from 'reducers';

export const getEns = (state: AppState) => state.ens;
export const getCurrentDomainName = (state: AppState) => getEns(state).domainSelector.currentDomain;
export const getCurrentDomainData = (state: AppState) => {
  const currentName = getCurrentDomainName(state);
  return currentName ? getEns(state).domainRequests[currentName] : null;
};
