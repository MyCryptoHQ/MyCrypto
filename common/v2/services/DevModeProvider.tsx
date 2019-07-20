import React, { Component, createContext } from 'react';

export interface ProviderState {
  isDevelopmentMode: boolean;
  toggleDevMode(): void;
}

const DevModeContext = createContext({} as ProviderState);

class DevModeProvider extends Component {
  public readonly state: ProviderState = {
    isDevelopmentMode: false,
    toggleDevMode: (): void => {
      this.setState({ isDevelopmentMode: !this.state.isDevelopmentMode });
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
