import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createAccount = create('accounts');
export const readAccount = read('accounts');
export const updateAccount = update('accounts');
export const deleteAccount = destroy('accounts');
export const readAccounts = readAll('accounts');
