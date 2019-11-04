import { create, read, update, destroy, readAll } from '../LocalCache';
import { ExtendedNetwork } from 'typeFiles';
import { makeExplorer } from 'services/EthService';

export const createNetworks = create('networks');
export const readNetworks = read('networks');
export const updateNetworks = update('networks');
export const deleteNetworks = destroy('networks');
export const readAllNetworks = () => {
  const networks = readAll('networks')();
  return networks.map(({ blockExplorer, ...rest }: ExtendedNetwork) => ({
    ...rest,
    blockExplorer: blockExplorer ? makeExplorer(blockExplorer) : blockExplorer
  }));
};
