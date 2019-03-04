import React, { Component } from 'react';

import { AccountService } from 'v2/services';

export const AccountContext = React.createContext();

export default class AccountProvider extends Component {
  public state = {
    accountHash: {},
    allAccounts: [],
    createAccount: accountConfig => {
      AccountService.instance.createAccount(accountConfig);
      this.syncAccounts();
    },
    updateAccount: (uuid, accountConfig) => {
      AccountService.instance.updateAccount(uuid, accountConfig);
      this.syncAccounts();
    },
    deleteAccount: uuid => {
      AccountService.instance.deleteAccount(uuid);
      this.syncAccounts();
    }
  };

  public render() {
    const { children } = this.props;

    return <AccountContext.Provider value={this.state}>{children}</AccountContext.Provider>;
  }

  private syncAccounts() {
    const { accountHash, allAccounts } = AccountService.instance;

    this.setState({
      accountHash,
      allAccounts
    });
  }
}
