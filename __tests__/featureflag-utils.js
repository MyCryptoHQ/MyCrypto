import { ClientFunction } from 'testcafe';

// Accesses functions available on window object that change state in FeatureFlagProvider
const setFeatureFlag = ClientFunction((key, value) => {
  window.setFeatureFlag(key, value);
});
const resetFeatureFlags = ClientFunction(() => {
  window.resetFeatureFlags();
});

export { setFeatureFlag, resetFeatureFlags };
