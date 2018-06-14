import { AppState } from 'features/reducers';

const getNetworks = (state: AppState) => state.config.networks;

export const getCustomNetworkConfigs = (state: AppState) => getNetworks(state).customNetworks;
