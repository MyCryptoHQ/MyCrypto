import React, { createContext, useEffect, useState } from 'react';

import { FEATURE_FLAGS, IFeatureFlags } from '@config';

export interface IFeatureFlagContext {
  featureFlags: IFeatureFlags;
  setFeatureFlag(key: keyof IFeatureFlags, value: boolean): void;
  resetFeatureFlags(): void;
  toggleFeatureFlag(key: keyof IFeatureFlags): void;
}

export const FeatureFlagContext = createContext({} as IFeatureFlagContext);

export const FeatureFlagProvider: React.FC = ({ children }) => {
  const [featureFlags, setFeatureFlags] = useState(FEATURE_FLAGS);

  const setFeatureFlag: IFeatureFlagContext['setFeatureFlag'] = (key, value) =>
    setFeatureFlags({ ...featureFlags, [key]: value });

  const toggleFeatureFlag: IFeatureFlagContext['toggleFeatureFlag'] = (key) =>
    setFeatureFlag(key, !featureFlags[key]);

  const resetFeatureFlags: IFeatureFlagContext['resetFeatureFlags'] = () =>
    setFeatureFlags(FEATURE_FLAGS);

  useEffect(() => {
    // For use in E2E testing
    (window as CustomWindow).setFeatureFlag = setFeatureFlag;
    (window as CustomWindow).resetFeatureFlags = resetFeatureFlags;
  });

  const stateContext: IFeatureFlagContext = {
    featureFlags,
    setFeatureFlag,
    toggleFeatureFlag,
    resetFeatureFlags
  };

  return <FeatureFlagContext.Provider value={stateContext}>{children}</FeatureFlagContext.Provider>;
};

export function useFeatureFlags() {
  const context = React.useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used with a Feature Flag Provider');
  }
  return context;
}
