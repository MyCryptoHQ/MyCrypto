import React, { Component, createContext } from 'react';
import AccountServiceBase from 'v2/services/Account/Account';
import { account, extendedAccount } from 'v2/services/Account';

interface State {
  accounts: extendedAccount[];
  createAccount(accountData: account): void;
  deleteAccount(uuid: string): void;
  updateAccount(uuid: string, accountData: account): void;
}

export const AccountContext = createContext({
  accounts: [],
  createAccount: (accountData: account) => undefined,
  deleteAccount: () => undefined,
  updateAccount: () => undefined
});

const Account = new AccountServiceBase();

export class AccountProvider extends Component {
  constructor(props: any) {
    super(props);
    Account.init();
  }

  public state: State = {
    accounts: Account.readAccounts() || [],
    createAccount: (accountData: account) => {
      Account.createAccount(accountData);
      this.getAccounts();
    },
    deleteAccount: (uuid: string) => {
      Account.deleteAccount(uuid);
      this.getAccounts();
    },
    updateAccount: (uuid: string, accountData: account) => {
      Account.updateAccount(uuid, accountData);
      this.getAccounts();
    }
  };

  private getAccounts = () => {
    const accounts: extendedAccount[] = Account.readAccounts() || [];
    this.setState({ accounts });
  };

  public render() {
    console.log(this.state.accounts);
    const { children } = this.props;
    return <AccountContext.Provider value={this.state}>{children}</AccountContext.Provider>;
  }
}
