import React, { createContext, useEffect, useState } from 'react';
import { IFeatures, FEATURE_FLAGS } from '@config';

export interface IFeatureFlagContext {
  IS_ACTIVE_FEATURE: IFeatures;
  setFeatureFlag(key: keyof IFeatures, value: boolean): void;
  resetFeatureFlags(): void;
}

const FeatureFlagContext = createContext({} as IFeatureFlagContext);

const FeatureFlagProvider: React.FC = ({ children }) => {
  const [featureFlags, setFeatureFlags] = useState(FEATURE_FLAGS);

  const setFeatureFlag = (key: keyof IFeatures, value: boolean): void =>
    setFeatureFlags({ ...featureFlags, [key]: value });
  const resetFeatureFlags = (): void => setFeatureFlags(FEATURE_FLAGS);

  useEffect(() => {
    // For use in E2E testing
    (window as CustomWindow).setFeatureFlag = setFeatureFlag;
    (window as CustomWindow).resetFeatureFlags = resetFeatureFlags;
  });

  const stateContext: IFeatureFlagContext = {
    IS_ACTIVE_FEATURE: featureFlags,
    setFeatureFlag,
    resetFeatureFlags
  };

  return <FeatureFlagContext.Provider value={stateContext}>{children}</FeatureFlagContext.Provider>;
};

function useFeatureFlags() {
  const context = React.useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used with a Feature Flag Provider');
  }
  return context;
}

export { FeatureFlagProvider, FeatureFlagContext, useFeatureFlags };
