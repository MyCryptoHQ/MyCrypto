import { useSelector } from 'react-redux';

import {
  addAccounts,
  destroyAccount,
  getAccounts,
  updateAccount as updateAccountRedux,
  updateAccounts as updateAccountsRedux,
  useDispatch
} from '@store';
import { Asset, IAccount, ITxReceipt, NetworkId, StoreAccount, TUuid } from '@types';
import { eqBy, prop, unionWith } from '@vendor';

import { getAccountByAddressAndNetworkName as getAccountByAddressAndNetworkNameFunc } from './helpers';

export interface IAccountContext {
  accounts: IAccount[];
  createMultipleAccountsWithIDs(accountData: IAccount[]): void;
  deleteAccount(account: IAccount): void;
  updateAccount(uuid: TUuid, accountData: IAccount): void;
  addTxToAccount(account: IAccount, transaction: ITxReceipt): void;
  getAccountByAddressAndNetworkName(address: string, networkId: NetworkId): IAccount | undefined;
  updateAccountAssets(account: StoreAccount, assets: Asset[]): Promise<void>;
  updateAllAccountsAssets(accounts: StoreAccount[], assets: Asset[]): Promise<void>;
  updateAccounts(toUpdate: IAccount[]): void;
  toggleAccountPrivacy(uuid: TUuid): void;
}

function useAccounts() {
  const accounts = useSelector(getAccounts);

  const dispatch = useDispatch();

  const createMultipleAccountsWithIDs = (newAccounts: IAccount[]) => {
    dispatch(addAccounts(newAccounts));
  };

  const deleteAccount = (account: IAccount) => dispatch(destroyAccount(account.uuid));

  const updateAccount = (_: TUuid, account: IAccount) => dispatch(updateAccountRedux(account));

  const addTxToAccount = (accountData: IAccount, newTx: ITxReceipt) => {
    const newAccountData = {
      ...accountData,
      transactions: [...accountData.transactions.filter((tx) => tx.hash !== newTx.hash), newTx]
    };
    updateAccount(accountData.uuid, newAccountData);
  };

  const removeTxFromAccount = (accountData: IAccount, tx: ITxReceipt) => {
    const newAccountData = {
      ...accountData,
      transactions: [...accountData.transactions.filter((t) => t.hash !== tx.hash)]
    };
    updateAccount(accountData.uuid, newAccountData);
  };

  const getAccountByAddressAndNetworkName = getAccountByAddressAndNetworkNameFunc(accounts);

  const updateAccounts = (toUpdate: IAccount[]) => {
    const newAccounts = unionWith(eqBy(prop('uuid')), toUpdate, accounts).filter(Boolean);
    dispatch(updateAccountsRedux(newAccounts));
  };

  const toggleAccountPrivacy = (uuid: TUuid) => {
    const existingAccount = accounts.find((x) => x.uuid === uuid);
    if (!existingAccount) return;
    updateAccount(uuid, {
      ...existingAccount,
      isPrivate: existingAccount.isPrivate ? !existingAccount.isPrivate : true
    });
  };

  return {
    accounts,
    createMultipleAccountsWithIDs,
    deleteAccount,
    updateAccount,
    addTxToAccount,
    removeTxFromAccount,
    getAccountByAddressAndNetworkName,
    updateAccounts,
    toggleAccountPrivacy
  };
}

export default useAccounts;
