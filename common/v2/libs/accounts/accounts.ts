import { getCache } from 'v2/services/LocalCache';
import { Account } from 'v2/services/Account/types';

export const getAllAccounts = () => {
  return Object.values(getCache().accounts);
};

export const getAccountByAddress = (address: string): Account | undefined => {
  const accounts: Account[] = getAllAccounts();
  return accounts.find(account => account.address.toLowerCase() === address.toLowerCase());
};
