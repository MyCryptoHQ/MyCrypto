import React, { createContext, useContext } from 'react';
import unionBy from 'lodash/unionBy';
import BigNumber from 'bignumber.js';
import * as R from 'ramda';

import {
  Account,
  ExtendedAccount,
  ITxReceipt,
  StoreAccount,
  Asset,
  AssetBalanceObject,
  LSKeys,
  TUuid
} from 'v2/types';
import { DataContext } from '../DataManager';
import { SettingsContext } from '../Settings';
import { getAccountByAddressAndNetworkName } from './helpers';
import { getAllTokensBalancesOfAccount } from '../BalanceService';

export interface IAccountContext {
  accounts: ExtendedAccount[];
  createAccountWithID(accountData: Account, uuid: TUuid): void;
  deleteAccount(account: ExtendedAccount): void;
  updateAccount(uuid: TUuid, accountData: ExtendedAccount): void;
  addNewTransactionToAccount(account: ExtendedAccount, transaction: ITxReceipt): void;
  getAccountByAddressAndNetworkName(address: string, network: string): ExtendedAccount | undefined;
  updateAccountAssets(account: StoreAccount, assets: Asset[]): Promise<void>;
  updateAccountsBalances(toUpate: ExtendedAccount[]): void;
}

export const AccountContext = createContext({} as IAccountContext);

export const AccountProvider: React.FC = ({ children }) => {
  const { createActions, accounts } = useContext(DataContext);
  const { addAccountToFavorites } = useContext(SettingsContext);
  const model = createActions(LSKeys.ACCOUNTS);

  const state: IAccountContext = {
    accounts,
    createAccountWithID: (item, uuid) => {
      addAccountToFavorites(uuid);
      model.create({ ...item, uuid });
    },
    deleteAccount: model.destroy,
    updateAccount: (uuid, a) => model.update(uuid, a),
    addNewTransactionToAccount: (accountData, newTransaction) => {
      const { network, ...newTxWithoutNetwork } = newTransaction;
      const newAccountData = {
        ...accountData,
        transactions: [
          ...accountData.transactions.filter(tx => tx.hash !== newTransaction.hash),
          newTxWithoutNetwork
        ]
      };
      state.updateAccount(accountData.uuid, newAccountData);
    },
    getAccountByAddressAndNetworkName: getAccountByAddressAndNetworkName(accounts),
    updateAccountAssets: async (storeAccount, assets) => {
      // Find all tokens with a positive balance for given account, and add those tokens to the assets array of the account
      const assetBalances = await getAllTokensBalancesOfAccount(storeAccount, assets);
      const positiveAssetBalances = Object.entries(assetBalances).filter(
        ([_, value]) => !value.isZero()
      );

      const existingAccount = accounts.find(x => x.uuid === storeAccount.uuid);

      if (existingAccount) {
        const newAssets: AssetBalanceObject[] = positiveAssetBalances.reduce(
          (tempAssets: AssetBalanceObject[], [contractAddress, balance]: [string, BigNumber]) => {
            const tempAsset = assets.find(x => x.contractAddress === contractAddress);
            if (tempAsset) {
              tempAssets.push({
                uuid: tempAsset.uuid,
                balance: balance.toString(10),
                mtime: Date.now()
              });
            }
            return tempAssets;
          },
          []
        );

        existingAccount.assets = unionBy(newAssets, existingAccount.assets, 'uuid');
        state.updateAccount(existingAccount.uuid, existingAccount);
      }
    },
    updateAccountsBalances: toUpdate => {
      const newAccounts = R.unionWith(R.eqBy(R.prop('uuid')), toUpdate, state.accounts).filter(
        Boolean
      );
      model.updateAll(newAccounts);
    }
  };
  return <AccountContext.Provider value={state}>{children}</AccountContext.Provider>;
};
