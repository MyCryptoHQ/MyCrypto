import React, { Component, createContext } from 'react';
import { IIS_ACTIVE_FEATURE, IS_ACTIVE_FEATURE } from '@config/isActiveFeature';

export interface ProviderState {
  IS_ACTIVE_FEATURE: IIS_ACTIVE_FEATURE;
  setFeatureFlag(key: keyof IIS_ACTIVE_FEATURE, value: boolean): void;
}

declare global {
  interface Window {
    setFeatureFlag(key: keyof IIS_ACTIVE_FEATURE, value: boolean): void;
  }
}

const FeatureFlagContext = createContext({} as ProviderState);

class FeatureFlagProvider extends Component {
  public readonly state: ProviderState = {
    IS_ACTIVE_FEATURE,
    setFeatureFlag: (key: keyof IIS_ACTIVE_FEATURE, value: boolean): void =>
      this.setState({ IS_ACTIVE_FEATURE: { ...IS_ACTIVE_FEATURE, [key]: value } })
  };

  public render() {
    const { children } = this.props;
    return <FeatureFlagContext.Provider value={this.state}>{children}</FeatureFlagContext.Provider>;
  }
}

function useFeatureFlags() {
  const context = React.useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used with a Feature Flag Provider');
  }
  return context;
}

export { FeatureFlagProvider, FeatureFlagContext, useFeatureFlags };
