import { AppState } from 'features/reducers';
import { getNetworks } from '../derivedSelectors';

export const getCustomNetworkConfigs = (state: AppState) => getNetworks(state).customNetworks;
