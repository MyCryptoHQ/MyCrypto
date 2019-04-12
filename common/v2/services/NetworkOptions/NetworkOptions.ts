import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createNetworkOptions = create('networkOptions');
export const readNetworkOptions = read('networkOptions');
export const updateNetworkOptions = update('networkOptions');
export const deleteNetworkOptions = destroy('networkOptions');
export const readAllNetworkOptions = readAll('networkOptions');
