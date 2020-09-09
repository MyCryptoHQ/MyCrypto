import { FEATURE_FLAGS } from '@config';
import { renderHook, act } from '@testing-library/react-hooks';

import { useFeatureFlags, FeatureFlagProvider } from './FeatureFlagProvider';

const renderUseFeatureFlags = () => {
  return renderHook(() => useFeatureFlags(), { wrapper: FeatureFlagProvider });
};

describe('useFeatureFlags', () => {
  it('uses the features config file ', () => {
    const { result } = renderUseFeatureFlags();
    expect(result.current.featureFlags).toEqual(FEATURE_FLAGS);
  });

  it('can set a feature flag value to false', () => {
    const { result } = renderUseFeatureFlags();
    const { setFeatureFlag } = result.current;
    const target = 'DASHBOARD';
    act(() => setFeatureFlag(target, false));
    expect(result.current.featureFlags[target]).toEqual(false);
  });

  it('can set a feature flag value to true', () => {
    const { result } = renderUseFeatureFlags();
    const { setFeatureFlag } = result.current;
    const target = 'DASHBOARD';
    act(() => setFeatureFlag(target, true));
    expect(result.current.featureFlags[target]).toEqual(true);
  });

  it('can reset the values to default', () => {
    const { result } = renderUseFeatureFlags();
    const { setFeatureFlag, resetFeatureFlags } = result.current;
    const target = 'DASHBOARD';
    act(() => setFeatureFlag(target, false));
    act(() => resetFeatureFlags());
    expect(result.current.featureFlags[target]).toEqual(true);
  });

  it('can toggle a value', () => {
    const { result } = renderUseFeatureFlags();
    const { toggleFeatureFlag, featureFlags } = result.current;
    const target = 'DASHBOARD';
    const original = featureFlags[target];
    act(() => toggleFeatureFlag(target));
    expect(result.current.featureFlags[target]).toEqual(!original);
  });
});
