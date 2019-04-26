import { getCache } from 'v2/services/LocalCache';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';

export const getAllNetworks = () => {
  return Object.values(getCache().networkOptions);
};

export const getNetworkByChainId = (chainId: string): Promise<NetworkOptions> => {
  return new Promise((resolve, reject) => {
    try {
      const networks = getAllNetworks();

      networks.map((network: NetworkOptions) => {
        if (network.chainId === parseInt(chainId, 16)) {
          resolve(network);
        }
      });
      reject();
    } catch (e) {
      reject();
    }
  });
};

export const getNetworkByName = async (name: string): Promise<NetworkOptions> => {
  return new Promise((resolve, reject) => {
    try {
      const networks = getAllNetworks();

      networks.map((network: NetworkOptions) => {
        if (network.name === name) {
          resolve(network);
        }
      });
      reject();
    } catch (e) {
      reject();
    }
  });
};
