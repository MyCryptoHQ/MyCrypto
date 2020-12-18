import { useContext } from 'react';

import eqBy from 'ramda/src/eqBy';
import prop from 'ramda/src/prop';
import unionWith from 'ramda/src/unionWith';

import { useAnalytics } from '@hooks';
import { ANALYTICS_CATEGORIES } from '@services/ApiService/Analytics';
import {
  createAccount,
  createAccounts,
  destroyAccount,
  updateAccount as updateAccountRedux,
  updateAccounts as updateAccountsRedux,
  useDispatch
} from '@store';
import {
  Asset,
  IAccount,
  IRawAccount,
  ITxReceipt,
  ITxStatus,
  ITxType,
  NetworkId,
  StoreAccount,
  TUuid
} from '@types';

import { DataContext } from '../DataManager';
import { useSettings } from '../Settings';
import { getAccountByAddressAndNetworkName as getAccountByAddressAndNetworkNameFunc } from './helpers';

export interface IAccountContext {
  accounts: IAccount[];
  createAccountWithID(uuid: TUuid, accountData: IRawAccount): void;
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
  const { accounts } = useContext(DataContext);
  const { addAccountToFavorites, addMultipleAccountsToFavorites } = useSettings();

  const dispatch = useDispatch();
  const trackTxHistory = useAnalytics({
    category: ANALYTICS_CATEGORIES.TX_HISTORY,
    actionName: 'Tx Made'
  });

  const createAccountWithID = (uuid: TUuid, item: IRawAccount) => {
    addAccountToFavorites(uuid);
    dispatch(createAccount({ ...item, uuid }));
  };

  const createMultipleAccountsWithIDs = (newAccounts: IAccount[]) => {
    addMultipleAccountsToFavorites(newAccounts.map(({ uuid }) => uuid));
    dispatch(createAccounts(newAccounts));
  };

  const deleteAccount = (account: IAccount) => dispatch(destroyAccount(account.uuid));

  const updateAccount = (_: TUuid, account: IAccount) => dispatch(updateAccountRedux(account));

  const addTxToAccount = (accountData: IAccount, newTx: ITxReceipt) => {
    if ('status' in newTx && [ITxStatus.SUCCESS, ITxStatus.FAILED].includes(newTx.status)) {
      trackTxHistory({
        eventParams: {
          txType: (newTx && newTx.txType) || ITxType.UNKNOWN,
          txStatus: newTx.status
        }
      });
    }
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
    createAccountWithID,
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
