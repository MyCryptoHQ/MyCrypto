import { AppState } from 'features/reducers';
import { getEns } from '../selectors';

export const getCurrentDomainName = (state: AppState) => getEns(state).domainSelector.currentDomain;
