import { ClientFunction, t } from 'testcafe';

import { FIXTURES_CONST } from './fixtures';
import { waitForProperty } from './helpers';

// Accesses functions available on window object that change state in FeatureFlagProvider
const setFeatureFlag = async (key, value) => {
  await t.expect(waitForProperty('setFeatureFlag', FIXTURES_CONST.TIMEOUT)).ok();
  await ClientFunction((key, value) => {
    window.setFeatureFlag(key, value);
  })(key, value);
};

const resetFeatureFlags = async () => {
  await t.expect(waitForProperty('resetFeatureFlags', FIXTURES_CONST.TIMEOUT)).ok();
  await ClientFunction(() => {
    window.resetFeatureFlags();
  });
};

export { setFeatureFlag, resetFeatureFlags };
