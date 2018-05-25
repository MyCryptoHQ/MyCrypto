import { AppState } from 'features/reducers';
import { getNetworks } from '../selectors';

export const getCustomNetworkConfigs = (state: AppState) => getNetworks(state).customNetworks;
