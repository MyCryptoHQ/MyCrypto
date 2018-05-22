import { AppState } from 'features/reducers';
import { getEns } from '../derivedSelectors';

export const getCurrentDomainName = (state: AppState) => getEns(state).domainSelector.currentDomain;
