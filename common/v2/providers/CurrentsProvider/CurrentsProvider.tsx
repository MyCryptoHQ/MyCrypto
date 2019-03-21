import React, { Component, createContext } from 'react';
import CurrentsServiceBase from 'v2/services/Currents/Currents';
import { Currents } from 'v2/services/Currents';

interface ProviderState {
  currents: Currents;
  updateCurrents(currentsData: Currents): void;
}

export const CurrentsContext = createContext({} as ProviderState);

const Currents = new CurrentsServiceBase();

export class CurrentsProvider extends Component {
  public readonly state: ProviderState = {
    currents: Currents.readCurrents() || [],
    updateCurrents: (currentsData: Currents) => {
      Currents.updateCurrents(currentsData);
      this.getCurrents();
    }
  };

  public render() {
    const { children } = this.props;
    return <CurrentsContext.Provider value={this.state}>{children}</CurrentsContext.Provider>;
  }

  private getCurrents = () => {
    const currents: Currents = Currents.readCurrents() || [];
    this.setState({ currents });
  };
}
