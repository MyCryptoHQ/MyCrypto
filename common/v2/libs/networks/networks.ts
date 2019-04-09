import { NetworkSelect } from './types';
import { CACHE_KEY } from 'v2/services/LocalCache/constants';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';

export const getNetworkByChainId = async (chainId: string): Promise<NetworkSelect>  => {
  const networks = await getAllNetworks();

  let networkToSelect = null;
  await Promise.all(
    networks.map((network: NetworkOptions) => {
      if (network.chainId === parseInt(chainId)) {
        networkToSelect = network;
      }
    })
  )
  return networkToSelect === null ? null: networkToSelect;
}

export const getAllNetworks = async (): Promise<NetworkOptions[]> => {
  const localCache = JSON.parse((localStorage.getItem(CACHE_KEY) || '{}'));
  const networks: NetworkOptions[] = [];
  await Promise.all(
    Object.keys(localCache.networkOptions).map((networkName: string) => {
      networks.push(localCache.networkOptions[networkName]);
    })
  )
  return networks;
}