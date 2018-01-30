import { AppState } from 'reducers';
import { getConfig } from 'selectors/config';
import {
  CustomNetworkConfig,
  StaticNetworkConfig,
  StaticNetworkNames,
  NetworkContract
} from 'types/network';

export const getNetworks = (state: AppState) => getConfig(state).networks;

export const getStaticNetworkNames = (state: AppState): StaticNetworkNames[] =>
  Object.keys(getNetworks(state).staticNetworks) as StaticNetworkNames[];

export const getStaticNetworkConfig = (state: AppState): StaticNetworkConfig | undefined => {
  const { staticNetworks, selectedNetwork } = getNetworks(state);
  const isDefaultNetworkName = (networkName: string): networkName is StaticNetworkNames =>
    Object.keys(staticNetworks).includes(networkName);
  const defaultNetwork = isDefaultNetworkName(selectedNetwork)
    ? staticNetworks[selectedNetwork]
    : undefined;
  return defaultNetwork;
};

export const getCustomNetworkConfig = (state: AppState): CustomNetworkConfig | undefined => {
  const { customNetworks, selectedNetwork } = getNetworks(state);
  const customNetwork = customNetworks[selectedNetwork];
  return customNetwork;
};

export const getNetworkConfig = (state: AppState): StaticNetworkConfig | CustomNetworkConfig => {
  const config = getStaticNetworkConfig(state) || getCustomNetworkConfig(state);

  if (!config) {
    const { selectedNetwork } = getNetworks(state);
    throw Error(
      `No network config found for ${selectedNetwork} in either static or custom networks`
    );
  }
  return config;
};

export const getNetworkContracts = (state: AppState): NetworkContract[] | null => {
  const network = getStaticNetworkConfig(state);
  return network ? network.contracts : [];
};

export const getCustomNetworkConfigs = (state: AppState) => getNetworks(state).customNetworks;

export const getStaticNetworkConfigs = (state: AppState) => getNetworks(state).staticNetworks;
