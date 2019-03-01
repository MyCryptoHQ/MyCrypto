import { AppState } from 'features/reducers';

const getEns = (state: AppState) => state.nameService;

export const getDomainRequests = (state: AppState) => getEns(state).domainRequests;
