import { AppState } from 'features/reducers';

const getEns = (state: AppState) => state.ens;

export const getCurrentDomainName = (state: AppState) => getEns(state).domainSelector.currentDomain;
