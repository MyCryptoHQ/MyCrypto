import { AppState } from 'reducers';
import { getConfig } from 'selectors/config';
import {
  DefaultNetworkConfig,
  CustomNetworkConfig,
  DefaultNetworkNames,
  NetworkContract
} from 'reducers/config/networks/typings';

export const getNetworks = (state: AppState) => getConfig(state).networks;

export const isCurrentNetworkDefault = (state: AppState): DefaultNetworkConfig | undefined => {
  const { defaultNetworks, selectedNetwork } = getNetworks(state);
  const isDefaultNetworkName = (networkName: string): networkName is DefaultNetworkNames =>
    Object.keys(defaultNetworks).includes(networkName);
  const defaultNetwork = isDefaultNetworkName(selectedNetwork)
    ? defaultNetworks[selectedNetwork]
    : undefined;
  return defaultNetwork;
};

export const isCurrentNetworkCustom = (state: AppState): CustomNetworkConfig | undefined => {
  const { customNetworks, selectedNetwork } = getNetworks(state);
  const customNetwork = customNetworks[selectedNetwork];
  return customNetwork;
};

export const getNetworkConfig = (
  state: AppState
): DefaultNetworkConfig | CustomNetworkConfig | undefined =>
  isCurrentNetworkDefault(state) || isCurrentNetworkCustom(state);

export const getNetworkContracts = (state: AppState): NetworkContract[] | null => {
  const network = isCurrentNetworkDefault(state);
  return network ? network.contracts : [];
};

export const getCustomNetworkConfigs = (state: AppState): CustomNetworkConfig[] => {
  const { customNetworks } = getNetworks(state);
  return Object.values(customNetworks);
};
