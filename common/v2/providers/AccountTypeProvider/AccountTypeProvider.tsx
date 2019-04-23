import React, { Component, createContext } from 'react';
import * as service from 'v2/services/AccountType/AccountType';
import { AccountType, ExtendedAccountType } from 'v2/services/AccountType';

export interface ProviderState {
  accountTypes: ExtendedAccountType[];
  createAccountType(accountTypeData: ExtendedAccountType): void;
  readAccountType(uuid: string): AccountType;
  deleteAccountType(uuid: string): void;
  updateAccountType(uuid: string, accountTypeData: ExtendedAccountType): void;
}

export const AccountTypeContext = createContext({} as ProviderState);

export class AccountTypeProvider extends Component {
  public readonly state: ProviderState = {
    accountTypes: service.readAccountTypes() || [],
    createAccountType: (accountTypeData: ExtendedAccountType) => {
      service.createAccountType(accountTypeData);
      this.getAccountTypes();
    },
    readAccountType: (uuid: string) => {
      return service.readAccountType(uuid);
    },
    deleteAccountType: (uuid: string) => {
      service.deleteAccountType(uuid);
      this.getAccountTypes();
    },
    updateAccountType: (uuid: string, accountTypeData: ExtendedAccountType) => {
      service.updateAccountType(uuid, accountTypeData);
      this.getAccountTypes();
    }
  };

  public render() {
    const { children } = this.props;
    return <AccountTypeContext.Provider value={this.state}>{children}</AccountTypeContext.Provider>;
  }

  private getAccountTypes = () => {
    const accountTypes: ExtendedAccountType[] = service.readAccountTypes() || [];
    this.setState({ accountTypes });
  };
}
