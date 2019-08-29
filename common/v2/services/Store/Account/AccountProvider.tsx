import React, { Component, createContext } from 'react';
import * as service from './Account';
import { Account, ExtendedAccount, ITxReceipt } from 'v2/types';

export interface ProviderState {
  accounts: ExtendedAccount[];
  createAccount(accountData: Account): void;
  createAccountWithID(accountData: Account, uuid: string): void;
  deleteAccount(uuid: string): void;
  updateAccount(uuid: string, accountData: ExtendedAccount): void;
  addNewTransactionToAccount(account: ExtendedAccount, transaction: ITxReceipt): void;
  getAccountByAddressAndNetworkName(address: string, network: string): ExtendedAccount | undefined;
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
      const existingTransaction = accountData.transactions.find(
        tx => tx.hash === newTransaction.hash
      );
      delete newTransaction.network;
      if (existingTransaction) {
        const newTransactionSet = accountData.transactions.filter(
          transaction => transaction.hash !== newTransaction.hash
        );
        accountData.transactions = [...newTransactionSet, newTransaction];
      } else {
        accountData.transactions = [...accountData.transactions, newTransaction];
      }
      service.updateAccount(accountData.uuid, accountData);
      this.getAccounts();
    },
    getAccountByAddressAndNetworkName: (address, network): ExtendedAccount | undefined => {
      const { accounts } = this.state;
      return accounts.find(
        account =>
          account.address.toLowerCase() === address.toLowerCase() && account.networkId === network
      );
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
