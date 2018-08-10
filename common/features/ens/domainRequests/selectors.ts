import { AppState } from 'features/reducers';

const getEns = (state: AppState) => state.ens;

export const getDomainRequests = (state: AppState) => getEns(state).domainRequests;
