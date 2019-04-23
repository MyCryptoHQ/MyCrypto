import React, { Component, createContext } from 'react';
import * as service from 'v2/services/RecentAccounts/RecentAccounts';
import { ExtendedRecentAccounts } from 'v2/services/RecentAccounts';

export interface ProviderState {
  recentAccounts: ExtendedRecentAccounts[];
  createRecentAccounts(uuid: string): void;
  deleteRecentAccounts(uuid: string): void;
}

export const RecentAccountsContext = createContext({} as ProviderState);

export class RecentAccountsProvider extends Component {
  public readonly state: ProviderState = {
    recentAccounts: service.readAllRecentAccounts() || [],
    createRecentAccounts: (uuid: string) => {
      service.createRecentAccounts(uuid);
      this.getRecentAccounts();
    },
    deleteRecentAccounts: (uuid: string) => {
      service.deleteRecentAccounts(uuid);
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
    const recentAccounts: ExtendedRecentAccounts[] = service.readAllRecentAccounts() || [];
    this.setState({ recentAccounts });
  };
}
