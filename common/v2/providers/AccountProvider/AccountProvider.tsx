import React, { Component, createContext } from 'react';
import AccountServiceBase from 'v2/services/Account/Account';
import { account, extendedAccount } from 'v2/services/Account';

export const AccountContext = createContext({
  accounts: [],
  addAccount: (accountData: account) => {},
  removeAccount: (uuid: string) => {}
});

const Account = new AccountServiceBase();

export class AccountProvider extends Component {
  constructor(props: any) {
    super(props);
    Account.init();
  }

  getAccounts = () => {
    const accounts: extendedAccount[] = Account.readAccounts() || [];
    this.setState({ accounts: accounts });
  };

  removeAccount = (uuid: string) => {
    Account.deleteAccount(uuid);
    this.getAccounts();
  };

  addAccount = (accountData: account) => {
    console.log('adding account');
    Account.createAccount(accountData);
    this.getAccounts();
  };

  state = {
    accounts: Account.readAccounts() || [],
    addAccount: this.addAccount,
    removeAccount: this.removeAccount
  };

  render() {
    const { children } = this.props;
    return <AccountContext.Provider value={this.state}>{children}</AccountContext.Provider>;
  }
}
