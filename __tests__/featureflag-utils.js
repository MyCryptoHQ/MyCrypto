import { t, ClientFunction } from 'testcafe';
import { FIXTURES_CONST } from './fixtures';

// Accesses functions available on window object that change state in FeatureFlagProvider
const _setFeatureFlag = ClientFunction((key, value) => {
  window.setFeatureFlag(key, value);
});
const _resetFeatureFlags = ClientFunction(() => {
  window.resetFeatureFlags();
});

const setFeatureFlag = async (key, value) => {
  await t
    .expect(ClientFunction(() => window.setFeatureFlag))
    .ok({ timeout: FIXTURES_CONST.TIMEOUT });
  await _setFeatureFlag(key, value);
};

const resetFeatureFlags = async () => {
  await t
    .expect(ClientFunction(() => window.resetFeatureFlags))
    .ok({ timeout: FIXTURES_CONST.TIMEOUT });
  await _resetFeatureFlags();
};

export { setFeatureFlag, resetFeatureFlags };
