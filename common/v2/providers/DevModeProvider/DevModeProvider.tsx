import React, { Component, createContext } from 'react';

export interface ProviderState {
  developmentMode: boolean;
  toggleDevMode(): void;
}

const DevModeContext = createContext({} as ProviderState);

class DevModeProvider extends Component {
  public readonly state: ProviderState = {
    developmentMode: false,
    toggleDevMode: (): void => {
      this.setState({ developmentMode: !this.state.developmentMode });
    }
  };

  public render() {
    const { children } = this.props;
    return <DevModeContext.Provider value={this.state}>{children}</DevModeContext.Provider>;
  }
}

function useDevMode() {
  const context = React.useContext(DevModeContext);
  if (context === undefined) {
    throw new Error('useDevMode must be used with a DevMode Provider');
  }
  return context;
}

export { DevModeProvider, DevModeContext, useDevMode };
