import React, { Component, createContext } from 'react';
import AccountServiceBase from 'v2/services/Account/Account';
import { Account, ExtendedAccount } from 'v2/services/Account';

interface State {
  accounts: ExtendedAccount[];
  createAccount(accountData: Account): void;
  deleteAccount(uuid: string): void;
  updateAccount(uuid: string, accountData: Account): void;
}

export const AccountContext = createContext({
  accounts: [],
  createAccount: (accountData: Account) => undefined,
  deleteAccount: () => undefined,
  updateAccount: () => undefined
});

const Account = new AccountServiceBase();

export class AccountProvider extends Component {
  public state: State = {
    accounts: Account.readAccounts() || [],
    createAccount: (accountData: Account) => {
      Account.createAccount(accountData);
      this.getAccounts();
    },
    deleteAccount: (uuid: string) => {
      Account.deleteAccount(uuid);
      this.getAccounts();
    },
    updateAccount: (uuid: string, accountData: Account) => {
      Account.updateAccount(uuid, accountData);
      this.getAccounts();
    }
  };
  constructor(props: any) {
    super(props);
    Account.init();
  }

  public render() {
    console.log(this.state.accounts);
    const { children } = this.props;
    return <AccountContext.Provider value={this.state}>{children}</AccountContext.Provider>;
  }

  private getAccounts = () => {
    const accounts: ExtendedAccount[] = Account.readAccounts() || [];
    this.setState({ accounts });
  };
}
