import React, { Component, createContext } from 'react';
import * as Account from 'v2/services/Account/Account';
import { ExtendedAccount } from 'v2/services/Account';

export interface ProviderState {
  accounts: ExtendedAccount[];
  createAccount(accountData: ExtendedAccount): void;
  deleteAccount(uuid: string): void;
  updateAccount(uuid: string, accountData: ExtendedAccount): void;
}

export const AccountContext = createContext({} as ProviderState);

export class AccountProvider extends Component {
  public readonly state: ProviderState = {
    accounts: Account.readAccounts() || [],
    createAccount: (accountData: ExtendedAccount) => {
      Account.createAccount(accountData);
      this.getAccounts();
    },
    deleteAccount: (uuid: string) => {
      Account.deleteAccount(uuid);
      this.getAccounts();
    },
    updateAccount: (uuid: string, accountData: ExtendedAccount) => {
      Account.updateAccount(uuid, accountData);
      this.getAccounts();
    }
  };

  public render() {
    const { children } = this.props;
    return <AccountContext.Provider value={this.state}>{children}</AccountContext.Provider>;
  }

  private getAccounts = () => {
    const accounts: ExtendedAccount[] = Account.readAccounts() || [];
    this.setState({ accounts });
  };
}
