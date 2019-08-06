import React, { Component, createContext } from 'react';
import * as service from './Account';
import { Account, ExtendedAccount } from 'v2/types';

export interface ProviderState {
  accounts: ExtendedAccount[];
  createAccount(accountData: Account): void;
  createAccountWithID(accountData: Account, uuid: string): void;
  deleteAccount(uuid: string): void;
  updateAccount(uuid: string, accountData: ExtendedAccount): void;
  getAccountByAddressAndNetworkName(
    address: string | undefined,
    network: string | undefined
  ): ExtendedAccount | undefined;
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
    getAccountByAddressAndNetworkName: (
      address: string | undefined,
      network: string | undefined
    ): ExtendedAccount | undefined => {
      if (!address || !network) {
        return;
      }
      const { accounts } = this.state;
      return accounts.find(
        account =>
          account.address.toLowerCase() === address.toLowerCase() && account.network === network
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
