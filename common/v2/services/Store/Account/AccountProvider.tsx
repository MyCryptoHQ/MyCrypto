import React, { Component, createContext } from 'react';
import unionBy from 'lodash/unionBy';

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

export interface ProviderState {
  accounts: ExtendedAccount[];
  createAccount(accountData: Account): void;
  createAccountWithID(accountData: Account, uuid: string): void;
  deleteAccount(uuid: string): void;
  updateAccount(uuid: string, accountData: ExtendedAccount): void;
  addNewTransactionToAccount(account: ExtendedAccount, transaction: ITxReceipt): void;
  getAccountByAddressAndNetworkName(address: string, network: string): ExtendedAccount | undefined;
  updateAccountAssets(account: StoreAccount, assets: Asset[]): Promise<void>;
}

export const AccountContext = createContext({} as ProviderState);

export class AccountProvider extends Component {
  public readonly state: ProviderState = {
    accounts: service.readAccounts() || [],
    createAccount: (accountData: Account) => {
      service.createAccount(accountData);
      this.getAccounts();
    },
    createAccountWithID: (accountData: Account, uuid: string) => {
      service.createAccountWithID(accountData, uuid);
      this.getAccounts();
    },
    deleteAccount: (uuid: string) => {
      service.deleteAccount(uuid);
      this.getAccounts();
    },
    updateAccount: (uuid: string, accountData: ExtendedAccount) => {
      service.updateAccount(uuid, accountData);
      this.getAccounts();
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
      this.getAccounts();
    },
    getAccountByAddressAndNetworkName: (address, network): ExtendedAccount | undefined => {
      const { accounts } = this.state;
      return accounts.find(
        account =>
          account.address.toLowerCase() === address.toLowerCase() && account.networkId === network
      );
    },
    updateAccountAssets: async (storeAccount, assets) => {
      // Find all tokens with a positive balance for given account, and add those tokens to the assets array of the account
      const assetBalances = await getAllTokensBalancesOfAccount(storeAccount, assets);
      const positiveAssetBalances = Object.entries(assetBalances).filter(([_, value]) => value);

      const existingAccount = this.state.accounts.find(x => x.uuid === storeAccount.uuid);

      if (existingAccount) {
        const newAssets: AssetBalanceObject[] = positiveAssetBalances.reduce(
          (tempAssets: AssetBalanceObject[], [contractAddress, balance]: [string, bigint]) => {
            const tempAsset = assets.find(x => x.contractAddress === contractAddress);
            if (tempAsset) {
              tempAssets.push({
                uuid: tempAsset.uuid,
                balance: balance.toString(),
                mtime: Date.now()
              });
            }
            return tempAssets;
          },
          []
        );

        existingAccount.assets = unionBy(newAssets, existingAccount.assets, 'uuid');
        this.state.updateAccount(existingAccount.uuid, existingAccount);
      }
    }
  };

  public render() {
    const { children } = this.props;
    return <AccountContext.Provider value={this.state}>{children}</AccountContext.Provider>;
  }

  private getAccounts = () => {
    const accounts: ExtendedAccount[] = service.readAccounts() || [];
    this.setState({ accounts });
  };
}
