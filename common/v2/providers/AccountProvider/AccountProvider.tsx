import React, { Component, createContext } from 'react';
import AccountServiceBase from 'v2/services/Account/Account';
import { account, extendedAccount } from 'v2/services/Account';

export const AccountContext = createContext({
  accounts: [],
  addAccount: (accountData: account) => {},
  removeAccount: (uuid: string) => {},
  updateAccount: (uuid: string, accountData: account) => {}
});

const Account = new AccountServiceBase();

export class AccountProvider extends Component {
  constructor(props: any) {
    super(props);
    Account.init();
  }

  public getAccounts = () => {
    const accounts: extendedAccount[] = Account.readAccounts() || [];
    this.setState({ accounts: accounts });
  };

  public removeAccount = (uuid: string) => {
    Account.deleteAccount(uuid);
    this.getAccounts();
  };

  public createAccount = (accountData: account) => {
    Account.createAccount(accountData);
    this.getAccounts();
  };

  public updateAccount = (uuid: string, accountData: account) => {
    Account.updateAccount(uuid, accountData);
    this.getAccounts();
  };

  public state = {
    accounts: Account.readAccounts() || [],
    createAccount: this.createAccount,
    removeAccount: this.removeAccount
  };

  render() {
    console.log(this.state.accounts);
    const { children } = this.props;
    return <AccountContext.Provider value={this.state}>{children}</AccountContext.Provider>;
  }
}
