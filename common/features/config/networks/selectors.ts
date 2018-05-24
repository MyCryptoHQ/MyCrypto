import { StaticNetworkIds } from 'types/network';
import { AppState } from 'features/reducers';
import { getConfig } from '../selectors';
import { getCustomNetworkConfigs } from './custom';
import { isStaticNetworkId, getStaticNetworkConfigs } from './static';

export const getNetworks = (state: AppState) => getConfig(state).networks;

export const getStaticNetworkIds = (state: AppState): StaticNetworkIds[] =>
  Object.keys(getNetworks(state).staticNetworks) as StaticNetworkIds[];

export const getNetworkConfigById = (state: AppState, networkId: string) =>
  isStaticNetworkId(state, networkId)
    ? getStaticNetworkConfigs(state)[networkId]
    : getCustomNetworkConfigs(state)[networkId];

export const getNetworkNameByChainId = (state: AppState, chainId: number | string) => {
  const network =
    Object.values(getStaticNetworkConfigs(state)).find(n => +n.chainId === +chainId) ||
    Object.values(getCustomNetworkConfigs(state)).find(n => +n.chainId === +chainId);
  if (!network) {
    return null;
  }
  return network.name;
};
