import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createTransactionHistory = create('transactionHistories');
export const readTransactionHistory = read('transactionHistories');
export const updateTransactionHistory = update('transactionHistories');
export const deleteTransactionHistory = destroy('transactionHistories');
export const readTransactionHistories = readAll('transactionHistories');
