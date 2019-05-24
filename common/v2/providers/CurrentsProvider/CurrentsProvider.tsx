import React, { Component, createContext } from 'react';

import { Currents, updateCurrents, readCurrents } from 'v2/services/Currents';

interface ProviderState {
  currents: Currents;
  updateCurrents(currentsData: Currents): void;
  updateCurrentsAccounts(accounts: string[]): void;
}

export const CurrentsContext = createContext({} as ProviderState);

export class CurrentsProvider extends Component {
  public readonly state: ProviderState = {
    currents: readCurrents() || {},

    updateCurrents: (currentsData: Currents) => {
      updateCurrents(currentsData);
      this.getCurrents();
    },

    updateCurrentsAccounts: (accounts: string[]) => {
      const currents = readCurrents();
      updateCurrents({ ...currents, accounts });
      this.getCurrents();
    }
  };

  public render() {
    const { children } = this.props;
    return <CurrentsContext.Provider value={this.state}>{children}</CurrentsContext.Provider>;
  }

  private getCurrents = () => {
    const currents = readCurrents() || {};
    this.setState({ currents });
  };
}
