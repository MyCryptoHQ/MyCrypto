import { createContext, FC, useContext, useEffect } from 'react';

import { useDispatch, useSelector } from '@store';

import {
  FeatureFlag,
  getFeatureFlags,
  resetFeatureFlags as resetFeatureFlagsAction,
  setFeatureFlag as setFeatureFlagAction
} from './slice';

export interface IFeatureFlagContext {
  featureFlags: ReturnType<typeof getFeatureFlags>;
  isFeatureActive(f: FeatureFlag): boolean;
  setFeatureFlag(key: FeatureFlag, value: boolean): void;
  resetFeatureFlags(): void;
}

export const FeatureFlagContext = createContext({} as IFeatureFlagContext);

export const FeatureFlagProvider: FC = ({ children }) => {
  const dispatch = useDispatch();
  const featureFlags = useSelector(getFeatureFlags);

  const setFeatureFlag: IFeatureFlagContext['setFeatureFlag'] = (key, value) =>
    dispatch(setFeatureFlagAction({ feature: key, isActive: value }));

  const resetFeatureFlags: IFeatureFlagContext['resetFeatureFlags'] = () =>
    dispatch(resetFeatureFlagsAction());

  const isFeatureActive: IFeatureFlagContext['isFeatureActive'] = (f) => !!featureFlags[f];

  useEffect(() => {
    // For use in E2E testing
    (window as CustomWindow).setFeatureFlag = setFeatureFlag;
    (window as CustomWindow).resetFeatureFlags = resetFeatureFlags;
  });

  const stateContext: IFeatureFlagContext = {
    featureFlags,
    isFeatureActive,
    setFeatureFlag,
    resetFeatureFlags
  };

  return <FeatureFlagContext.Provider value={stateContext}>{children}</FeatureFlagContext.Provider>;
};

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used with a Feature Flag Provider');
  }
  return context;
}
