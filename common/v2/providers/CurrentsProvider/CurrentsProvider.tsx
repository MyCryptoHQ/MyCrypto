import React, { Component, createContext } from 'react';
import * as service from 'v2/services/Currents/Currents';
import { Currents } from 'v2/services/Currents';

interface ProviderState {
  currents: Currents;
  updateCurrents(currentsData: Currents): void;
}

export const CurrentsContext = createContext({} as ProviderState);

export class CurrentsProvider extends Component {
  public readonly state: ProviderState = {
    currents: service.readCurrents() || [],
    updateCurrents: (currentsData: Currents) => {
      service.updateCurrents(currentsData);
      this.getCurrents();
    }
  };

  public render() {
    const { children } = this.props;
    return <CurrentsContext.Provider value={this.state}>{children}</CurrentsContext.Provider>;
  }

  private getCurrents = () => {
    const currents: Currents = service.readCurrents() || [];
    this.setState({ currents });
  };
}
