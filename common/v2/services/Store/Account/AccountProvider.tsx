import React, { createContext, useContext } from 'react';
import unionBy from 'lodash/unionBy';
import property from 'lodash/property';
import BigNumber from 'bignumber.js';
import unionWith from 'ramda/src/unionWith';
import isEmpty from 'ramda/src/isEmpty';
import eqBy from 'ramda/src/eqBy';
import prop from 'ramda/src/prop';

import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services/ApiService/Analytics';

import {
  IRawAccount,
  IAccount,
  ITxReceipt,
  StoreAccount,
  Asset,
  AssetBalanceObject,
  LSKeys,
  TUuid,
  ITxStatus,
  ITxType
} from 'v2/types';

import { DataContext } from '../DataManager';
import { SettingsContext } from '../Settings';
import { getAccountByAddressAndNetworkName } from './helpers';
import { getAllTokensBalancesOfAccount } from '../BalanceService';

export interface IAccountContext {
  accounts: IAccount[];
  createAccountWithID(accountData: IRawAccount, uuid: TUuid): void;
  deleteAccount(account: IAccount): void;
  updateAccount(uuid: TUuid, accountData: IAccount): void;
  addNewTransactionToAccount(account: IAccount, transaction: ITxReceipt): void;
  getAccountByAddressAndNetworkName(address: string, network: string): IAccount | undefined;
  updateAccountAssets(account: StoreAccount, assets: Asset[]): Promise<void>;
  updateAllAccountsAssets(accounts: StoreAccount[], assets: Asset[]): Promise<void>;
  updateAccountsBalances(toUpate: IAccount[]): void;
  toggleAccountPrivacy(uuid: TUuid): void;
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
      if (
        'stage' in newTxWithoutNetwork &&
        [ITxStatus.SUCCESS, ITxStatus.FAILED].includes(newTxWithoutNetwork.stage!)
      ) {
        AnalyticsService.instance.track(ANALYTICS_CATEGORIES.TX_HISTORY, `Tx Made`, {
          txType: (newTxWithoutNetwork && newTxWithoutNetwork.type) || ITxType.UNKNOWN,
          txStatus: newTxWithoutNetwork.stage
        });
      }
      const newAccountData = {
        ...accountData,
        transactions: [
          ...accountData.transactions.filter((tx) => tx.hash !== newTransaction.hash),
          newTxWithoutNetwork
        ]
      };
      state.updateAccount(accountData.uuid, newAccountData);
    },
    getAccountByAddressAndNetworkName: getAccountByAddressAndNetworkName(accounts),
    updateAccountAssets: async (storeAccount, assets) => {
      // Find all tokens with a positive balance for given account, and add those tokens to the assets array of the account
      return getAllTokensBalancesOfAccount(storeAccount, assets).then((assetBalances) => {
        const positiveAssetBalances = Object.entries(assetBalances).filter(
          ([_, value]) => !value.isZero()
        );

        const existingAccount = accounts.find((x) => x.uuid === storeAccount.uuid);

        if (existingAccount) {
          const newAssets: AssetBalanceObject[] = positiveAssetBalances.reduce(
            (tempAssets: AssetBalanceObject[], [contractAddress, balance]: [string, BigNumber]) => {
              const tempAsset = assets.find((x) => x.contractAddress === contractAddress);
              return [
                ...tempAssets,
                ...(tempAsset
                  ? [
                      {
                        uuid: tempAsset.uuid,
                        balance: balance.toString(10),
                        mtime: Date.now()
                      }
                    ]
                  : [])
              ];
            },
            []
          );

          existingAccount.assets = unionBy(newAssets, existingAccount.assets, property('uuid'));
          state.updateAccount(existingAccount.uuid, existingAccount);
        }
      });
    },
    updateAllAccountsAssets: (storeAccounts, assets) =>
      Promise.all(
        storeAccounts.map(async (storeAccount) => {
          // Find all tokens with a positive balance for given account, and add those tokens to the assets array of the account
          return getAllTokensBalancesOfAccount(storeAccount, assets).then((assetBalances) => {
            const positiveAssetBalances = Object.entries(assetBalances).filter(
              ([_, value]) => !value.isZero()
            );

            const existingAccount = accounts.find((x) => x.uuid === storeAccount.uuid);
            if (!existingAccount) return {} as IAccount; // no existing account found

            const newAssets: AssetBalanceObject[] = positiveAssetBalances.reduce(
              (
                tempAssets: AssetBalanceObject[],
                [contractAddress, balance]: [string, BigNumber]
              ) => {
                const tempAsset = assets.find((x) => x.contractAddress === contractAddress);
                return [
                  ...tempAssets,
                  ...(tempAsset
                    ? [
                        {
                          uuid: tempAsset.uuid,
                          balance: balance.toString(10),
                          mtime: Date.now()
                        }
                      ]
                    : [])
                ];
              },
              []
            );

            existingAccount.assets = unionBy(newAssets, existingAccount.assets, property('uuid'));
            return existingAccount;
          });
        })
      )
        .then((data) => data.filter((accountItem) => !isEmpty(accountItem)))
        .then((updatedAccounts) => model.updateAll(updatedAccounts))
        .catch((err) => {
          console.debug('[AccountProvider]: Scan Tokens Error:', err);
        }),
    updateAccountsBalances: (toUpdate) => {
      const newAccounts = unionWith(eqBy(prop('uuid')), toUpdate, state.accounts).filter(Boolean);
      model.updateAll(newAccounts);
    },
    toggleAccountPrivacy: (uuid) => {
      const existingAccount = accounts.find((x) => x.uuid === uuid);
      if (!existingAccount) return;
      state.updateAccount(uuid, {
        ...existingAccount,
        isPrivate: existingAccount.isPrivate ? !existingAccount.isPrivate : true
      });
    }
  };
  return <AccountContext.Provider value={state}>{children}</AccountContext.Provider>;
};
