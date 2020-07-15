import { ClientFunction } from 'testcafe';

const setFeatureFlag = ClientFunction((key, value) => {
  window.setFeatureFlag(key, value);
});
const clearFeatureFlags = ClientFunction(() => {
  window.clearFeatureFlags();
});

export { setFeatureFlag, clearFeatureFlags };
