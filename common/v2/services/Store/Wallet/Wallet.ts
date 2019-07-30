import { create, destroy, read, readAll, update } from '../LocalCache';

export const createWallet = create('wallets');
export const readWallet = read('wallets');
export const updateWallet = update('wallets');
export const deleteWallet = destroy('wallets');
export const readWallets = readAll('wallets');
