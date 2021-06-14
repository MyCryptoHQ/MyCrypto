import { defaultSettings, getCurrentDBConfig } from '@database';
import { LSKeys } from '@types';

import { deMarshallState, marshallState } from '../DataManager/utils';

export const emptyState = {
  version: getCurrentDBConfig().version,
  [LSKeys.ACCOUNTS]: [],
  [LSKeys.ADDRESS_BOOK]: [],
  [LSKeys.ASSETS]: [],
  [LSKeys.RATES]: {},
  [LSKeys.TRACKED_ASSETS]: {},
  [LSKeys.CONTRACTS]: [],
  [LSKeys.NETWORKS]: [],
  [LSKeys.NOTIFICATIONS]: [],
  [LSKeys.SETTINGS]: defaultSettings,
  [LSKeys.USER_ACTIONS]: []
};
/**
 * @todo migrate to new store structure once redux-persist is in setup.
 * The initial state is the equivalent of `marshallState(getCurrentDBConfig().defaultValues)`
 * We redeclare it here to avoid circular dep issues and changing multiple imports.
 * Will be changed once we refactor to slices.
 */
export const initialLegacyState = marshallState(deMarshallState(emptyState));
