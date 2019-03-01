import { AppState } from 'features/reducers';

const getNameService = (state: AppState) => state.nameService;

export const getCurrentDomainName = (state: AppState) =>
  getNameService(state).domainSelector.currentDomain;
