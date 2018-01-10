import { AppState } from 'reducers';

export const getEns = (state: AppState) => state.ens;

export const getCurrentDomainName = (state: AppState) => getEns(state).domainSelector.currentDomain;

export const getCurrentDomainData = (state: AppState) => {
  const currentName = getCurrentDomainName(state);
  return currentName ? getEns(state).domainRequests[currentName] : null;
};

export const getBidDataEncoded = (state: AppState) => getEns(state).placeBid.bidPlaced;

export const getFields = (state: AppState) => getEns(state).fields;
export const getBid = (state: AppState) => getFields(state).bid;
export const getBidMask = (state: AppState) => getFields(state).bidMask;
export const getSecret = (state: AppState) => getFields(state).secret;
