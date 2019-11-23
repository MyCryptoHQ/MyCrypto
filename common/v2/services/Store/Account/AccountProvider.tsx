import React, { createContext, useState, useEffect } from 'react';
import unionBy from 'lodash/unionBy';
import BigNumber from 'bignumber.js';

import * as service from './Account';
import {
  Account,
  ExtendedAccount,
  ITxReceipt,
  StoreAccount,
  Asset,
  AssetBalanceObject
} from 'v2/types';
import { getAllTokensBalancesOfAccount } from '../BalanceService';

export interface State {
  accounts: ExtendedAccount[];

  createAccount(accountData: Account): void;
  createAccountWithID(accountData: Account, uuid: string): void;
  deleteAccount(uuid: string): void;
  updateAccount(uuid: string, accountData: ExtendedAccount): void;
  addNewTransactionToAccount(account: ExtendedAccount, transaction: ITxReceipt): void;
  getAccountByAddressAndNetworkName(address: string, network: string): ExtendedAccount | undefined;
  updateAccountAssets(account: StoreAccount, assets: Asset[]): Promise<void>;
}

export const AccountContext = createContext({} as State);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchedAccounts = service.readAccounts();
  const [accounts, setAccounts] = useState(fetchedAccounts || []);
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);
  useEffect(() => {
    if (!isUpdateNeeded) {
      return;
    }
    const accs = service.readAccounts() || [];
    setAccounts(accs);
    setIsUpdateNeeded(false);
  }, [isUpdateNeeded]);

  const state: State = {
    accounts,
    createAccount: (accountData: Account) => {
      service.createAccount(accountData);
      setIsUpdateNeeded(true);
    },
    createAccountWithID: (accountData: Account, uuid: string) => {
      service.createAccountWithID(accountData, uuid);
      setIsUpdateNeeded(true);
    },
    deleteAccount: (uuid: string) => {
      service.deleteAccount(uuid);
      setIsUpdateNeeded(true);
    },
    updateAccount: (uuid: string, accountData: ExtendedAccount) => {
      service.updateAccount(uuid, accountData);
      setIsUpdateNeeded(true);
    },
    addNewTransactionToAccount: (accountData, newTransaction) => {
      const { network, ...newTxWithoutNetwork } = newTransaction;
      const newAccountData = {
        ...accountData,
        transactions: [
          ...accountData.transactions.filter(tx => tx.hash !== newTransaction.hash),
          newTxWithoutNetwork
        ]
      };
      service.updateAccount(accountData.uuid, newAccountData);
      setIsUpdateNeeded(true);
    },
    getAccountByAddressAndNetworkName: (address, network): ExtendedAccount | undefined => {
      return accounts.find(
        account =>
          account.address.toLowerCase() === address.toLowerCase() && account.networkId === network
      );
    },
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
        service.updateAccount(existingAccount.uuid, existingAccount);
        setIsUpdateNeeded(true);
      }
    }
  };
  return <AccountContext.Provider value={state}>{children}</AccountContext.Provider>;
};
