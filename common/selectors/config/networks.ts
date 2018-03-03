import { AppState } from 'reducers';
import {
  CustomNetworkConfig,
  StaticNetworkConfig,
  StaticNetworkIds,
  NetworkContract
} from 'types/network';
import { getNodeConfig } from 'selectors/config';
const getConfig = (state: AppState) => state.config;

export const getNetworks = (state: AppState) => getConfig(state).networks;

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

export const getStaticNetworkIds = (state: AppState): StaticNetworkIds[] =>
  Object.keys(getNetworks(state).staticNetworks) as StaticNetworkIds[];

export const isStaticNetworkId = (
  state: AppState,
  networkId: string
): networkId is StaticNetworkIds => Object.keys(getStaticNetworkConfigs(state)).includes(networkId);

export const getStaticNetworkConfig = (state: AppState): StaticNetworkConfig | undefined => {
  const selectedNetwork = getSelectedNetwork(state);

  const { staticNetworks } = getNetworks(state);

  const defaultNetwork = isStaticNetworkId(state, selectedNetwork)
    ? staticNetworks[selectedNetwork]
    : undefined;
  return defaultNetwork;
};

export const getSelectedNetwork = (state: AppState) => getNodeConfig(state).network;

export const getCustomNetworkConfig = (state: AppState): CustomNetworkConfig | undefined => {
  const selectedNetwork = getSelectedNetwork(state);
  const { customNetworks } = getNetworks(state);
  const customNetwork = customNetworks[selectedNetwork];
  return customNetwork;
};

export const getNetworkConfig = (state: AppState): StaticNetworkConfig | CustomNetworkConfig => {
  const config = getStaticNetworkConfig(state) || getCustomNetworkConfig(state);

  if (!config) {
    const selectedNetwork = getSelectedNetwork(state);

    throw Error(
      `No network config found for ${selectedNetwork} in either static or custom networks`
    );
  }
  return config;
};

export const getNetworkUnit = (state: AppState): string => {
  return getNetworkConfig(state).unit;
};

export const getNetworkContracts = (state: AppState): NetworkContract[] | null => {
  const network = getStaticNetworkConfig(state);
  return network ? network.contracts : [];
};

export const getCustomNetworkConfigs = (state: AppState) => getNetworks(state).customNetworks;

export const getStaticNetworkConfigs = (state: AppState) => getNetworks(state).staticNetworks;

export const isNetworkUnit = (state: AppState, unit: string) => {
  return unit === getNetworkUnit(state);
};
