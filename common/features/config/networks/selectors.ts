import { StaticNetworkIds } from 'types/network';
import { AppState } from 'features/reducers';
import * as configMetaNetworksCustomSelectors from './custom/selectors';
import * as configMetaNetworksStaticSelectors from './static/selectors';

const getConfig = (state: AppState) => state.config;

export const getNetworks = (state: AppState) => getConfig(state).networks;

export const getStaticNetworkIds = (state: AppState): StaticNetworkIds[] =>
  Object.keys(getNetworks(state).staticNetworks) as StaticNetworkIds[];

export const getNetworkConfigById = (state: AppState, networkId: string) =>
  configMetaNetworksStaticSelectors.isStaticNetworkId(state, networkId)
    ? configMetaNetworksStaticSelectors.getStaticNetworkConfigs(state)[networkId]
    : configMetaNetworksCustomSelectors.getCustomNetworkConfigs(state)[networkId];

export const getNetworkByChainId = (state: AppState, chainId: number | string) => {
  const network =
    Object.values(configMetaNetworksStaticSelectors.getStaticNetworkConfigs(state)).find(
      n => +n.chainId === +chainId
    ) ||
    Object.values(configMetaNetworksCustomSelectors.getCustomNetworkConfigs(state)).find(
      n => +n.chainId === +chainId
    );
  if (!network) {
    return null;
  }
  return network;
};
