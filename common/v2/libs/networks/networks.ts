import { getCache } from 'v2/services/LocalCache';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';

export const getAllNetworks = () => {
  return Object.values(getCache().networkOptions);
};

export const getNetworkByChainId = (chainId: string): NetworkOptions | undefined => {
  const networks = getAllNetworks() || [];
  return networks.find((network: NetworkOptions) => network.chainId === parseInt(chainId, 16));
};

export const getNetworkByName = (name: string): NetworkOptions | undefined => {
  const networks = getAllNetworks() || [];
  return networks.find((network: NetworkOptions) => network.name === name);
};
