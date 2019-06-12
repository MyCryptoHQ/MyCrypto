import { create, read, update, destroy, readAll, createWithID } from 'v2/services/LocalCache';

export const createAccount = create('accounts');
export const createAccountWithID = createWithID('accounts');
export const readAccount = read('accounts');
export const updateAccount = update('accounts');
export const deleteAccount = destroy('accounts');
export const readAccounts = readAll('accounts');
