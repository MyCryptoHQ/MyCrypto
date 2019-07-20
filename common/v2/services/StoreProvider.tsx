import React, { Component, createContext } from 'react';

interface State {
  demo: [];
}

export const StoreContext = createContext({} as State);

// Used for dynamic values from other providers such as
// currentAccount tokens and fiatValues
export class StoreProvider extends Component {
  public readonly state: State = {
    demo: []
  };

  public render() {
    const { children } = this.props;
    return <StoreContext.Provider value={this.state}>{children}</StoreContext.Provider>;
  }
}
