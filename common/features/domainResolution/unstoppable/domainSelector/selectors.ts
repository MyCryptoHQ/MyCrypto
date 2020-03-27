import { AppState } from 'features/reducers';

const getUnstoppable = (state: AppState) => state.unstoppableResolution;

export const getCurrentDomainName = (state: AppState) =>
  getUnstoppable(state).domainSelector.currentDomain;
