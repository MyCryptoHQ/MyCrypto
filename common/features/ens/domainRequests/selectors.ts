import { AppState } from 'features/reducers';
import { getEns } from '../derivedSelectors';

export const getDomainRequests = (state: AppState) => getEns(state).domainRequests;
