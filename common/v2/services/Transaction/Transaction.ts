import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createTransaction = create('transactions');
export const readTransaction = read('transactions');
export const updateTransaction = update('transactions');
export const deleteTransaction = destroy('transactions');
export const readTransactions = readAll('transactions');
