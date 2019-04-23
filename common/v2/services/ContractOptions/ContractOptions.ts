import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createContractOptions = create('contractOptions');
export const readContractOptions = read('contractOptions');
export const updateContractOptions = update('contractOptions');
export const deleteContractOptions = destroy('contractOptions');
export const readAllContractOptions = readAll('contractOptions');
