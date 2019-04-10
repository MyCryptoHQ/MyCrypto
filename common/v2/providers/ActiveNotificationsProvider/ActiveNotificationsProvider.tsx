import React, { Component, createContext } from 'react';
import * as service from 'v2/services/ActiveNotifications/ActiveNotifications';
import { ExtendedActiveNotifications } from 'v2/services/ActiveNotifications';

export interface ProviderState {
  activeNotifications: ExtendedActiveNotifications[];
  createActiveNotifications(activeNotificationsData: ExtendedActiveNotifications): void;
  deleteActiveNotifications(uuid: string): void;
  updateActiveNotifications(
    uuid: string,
    activeNotificationsData: ExtendedActiveNotifications
  ): void;
}

export const ActiveNotificationsContext = createContext({} as ProviderState);

export class ActiveNotificationsProvider extends Component {
  public readonly state: ProviderState = {
    activeNotifications: service.readAllActiveNotifications() || [],
    createActiveNotifications: (activeNotificationsData: ExtendedActiveNotifications) => {
      service.createActiveNotifications(activeNotificationsData);
      this.getActiveNotifications();
    },
    deleteActiveNotifications: (uuid: string) => {
      service.deleteActiveNotifications(uuid);
      this.getActiveNotifications();
    },
    updateActiveNotifications: (
      uuid: string,
      activeNotificationsData: ExtendedActiveNotifications
    ) => {
      service.updateActiveNotifications(uuid, activeNotificationsData);
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
      service.readAllActiveNotifications() || [];
    this.setState({ activeNotifications });
  };
}
