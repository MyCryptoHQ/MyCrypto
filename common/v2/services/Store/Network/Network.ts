import { create, read, update, destroy, readAll } from '../LocalCache';
import { ExtendedNetwork } from 'v2/types';
import { makeExplorer } from 'utils/helpers'

export const createNetworks = create('networks');
export const readNetworks = read('networks');
export const updateNetworks = update('networks');
export const deleteNetworks = destroy('networks');
export const readAllNetworks = () => {
    const networks = readAll('networks')();
    return networks.map(({ blockExplorer, ...rest } : ExtendedNetwork) => ({
        ...rest,
         blockExplorer: blockExplorer ? makeExplorer(blockExplorer) : blockExplorer 
    }));
};
