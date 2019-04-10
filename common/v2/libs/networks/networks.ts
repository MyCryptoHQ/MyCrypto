import { NetworkSelect } from './types';
import { getCache } from 'v2/services/LocalCache';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';

export const getNetworkByChainId = (chainId: string): NetworkSelect => {
  const networks = getAllNetworks();

  let networkToSelect = null;
  networks.map((network: NetworkOptions) => {
    if (network.chainId === parseInt(chainId)) {
      networkToSelect = network;
    }
  });
  return networkToSelect === null ? null : networkToSelect;
};

export const getAllNetworks = () => {
  return Object.values(getCache().networkOptions);
};
