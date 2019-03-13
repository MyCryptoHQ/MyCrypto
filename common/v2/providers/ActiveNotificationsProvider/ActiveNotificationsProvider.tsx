import React, { Component, createContext } from 'react';
import ActiveNotificationsServiceBase from 'v2/services/ActiveNotifications/ActiveNotifications';
import { ExtendedActiveNotifications } from 'v2/services/ActiveNotifications';

export interface ProviderState {
  activeNotifications: ExtendedActiveNotifications[];
  createActiveNotifications(ActiveNotificationsData: ExtendedActiveNotifications): void;
  deleteActiveNotifications(uuid: string): void;
  updateActiveNotifications(
    uuid: string,
    ActiveNotificationsData: ExtendedActiveNotifications
  ): void;
}

export const ActiveNotificationsContext = createContext({} as ProviderState);

const ActiveNotifications = new ActiveNotificationsServiceBase();

export class ActiveNotificationsProvider extends Component {
  public readonly state: ProviderState = {
    activeNotifications: ActiveNotifications.readAllActiveNotifications() || [],
    createActiveNotifications: (activeNotificationsData: ExtendedActiveNotifications) => {
      ActiveNotifications.createActiveNotifications(activeNotificationsData);
      this.getActiveNotifications();
    },
    deleteActiveNotifications: (uuid: string) => {
      ActiveNotifications.deleteActiveNotifications(uuid);
      this.getActiveNotifications();
    },
    updateActiveNotifications: (
      uuid: string,
      activeNotificationsData: ExtendedActiveNotifications
    ) => {
      ActiveNotifications.updateActiveNotifications(uuid, activeNotificationsData);
      this.getActiveNotifications();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <ActiveNotificationsContext.Provider value={this.state}>
        {children}
      </ActiveNotificationsContext.Provider>
    );
  }

  private getActiveNotifications = () => {
    const activeNotifications: ExtendedActiveNotifications[] =
      ActiveNotifications.readAllActiveNotifications() || [];
    this.setState({ activeNotifications });
  };
}
