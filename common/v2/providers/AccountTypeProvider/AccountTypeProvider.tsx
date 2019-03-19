import React, { Component, createContext } from 'react';
import AccountTypeServiceBase from 'v2/services/AccountType/AccountType';
import { AccountType, ExtendedAccountType } from 'v2/services/AccountType';

export interface ProviderState {
  accountTypes: ExtendedAccountType[];
  createAccountType(accountTypeData: ExtendedAccountType): void;
  readAccountType(uuid: string): AccountType;
  deleteAccountType(uuid: string): void;
  updateAccountType(uuid: string, accountTypeData: ExtendedAccountType): void;
}

export const AccountTypeContext = createContext({} as ProviderState);

const AccountType = new AccountTypeServiceBase();

export class AccountTypeProvider extends Component {
  public readonly state: ProviderState = {
    accountTypes: AccountType.readAccountTypes() || [],
    createAccountType: (accountTypeData: ExtendedAccountType) => {
      AccountType.createAccountType(accountTypeData);
      this.getAccountTypes();
    },
    readAccountType: (uuid: string) => {
      return AccountType.readAccountType(uuid);
    },
    deleteAccountType: (uuid: string) => {
      AccountType.deleteAccountType(uuid);
      this.getAccountTypes();
    },
    updateAccountType: (uuid: string, accountTypeData: ExtendedAccountType) => {
      AccountType.updateAccountType(uuid, accountTypeData);
      this.getAccountTypes();
    }
  };

  public render() {
    const { children } = this.props;
    return <AccountTypeContext.Provider value={this.state}>{children}</AccountTypeContext.Provider>;
  }

  private getAccountTypes = () => {
    const accountTypes: ExtendedAccountType[] = AccountType.readAccountTypes() || [];
    this.setState({ accountTypes });
  };
}
