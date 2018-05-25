import { AppState } from 'features/reducers';
import { getEns } from '../selectors';

export const getDomainRequests = (state: AppState) => getEns(state).domainRequests;
