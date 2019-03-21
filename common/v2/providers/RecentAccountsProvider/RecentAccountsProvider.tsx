import React, { Component, createContext } from 'react';
import RecentAccountsServiceBase from 'v2/services/RecentAccounts/RecentAccounts';
import { ExtendedRecentAccounts } from 'v2/services/RecentAccounts';

export interface ProviderState {
  recentAccounts: ExtendedRecentAccounts[];
  createRecentAccounts(uuid: string): void;
  deleteRecentAccounts(uuid: string): void;
}

export const RecentAccountsContext = createContext({} as ProviderState);

const RecentAccounts = new RecentAccountsServiceBase();

export class RecentAccountsProvider extends Component {
  public readonly state: ProviderState = {
    recentAccounts: RecentAccounts.readAllRecentAccounts() || [],
    createRecentAccounts: (uuid: string) => {
      RecentAccounts.createRecentAccounts(uuid);
      this.getRecentAccounts();
    },
    deleteRecentAccounts: (uuid: string) => {
      RecentAccounts.deleteRecentAccounts(uuid);
      this.getRecentAccounts();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <RecentAccountsContext.Provider value={this.state}>{children}</RecentAccountsContext.Provider>
    );
  }

  private getRecentAccounts = () => {
    const recentAccounts: ExtendedRecentAccounts[] = RecentAccounts.readAllRecentAccounts() || [];
    this.setState({ recentAccounts });
  };
}
