import { AppState } from 'features/reducers';

const getUnstoppable = (state: AppState) => state.unstoppableResolution;

export const getUnstoppableRequests = (state: AppState) => getUnstoppable(state).domainRequests;
