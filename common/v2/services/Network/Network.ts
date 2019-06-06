import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createNetworks = create('networks');
export const readNetworks = read('networks');
export const updateNetworks = update('networks');
export const deleteNetworks = destroy('networks');
export const readAllNetworks = readAll('networks');
