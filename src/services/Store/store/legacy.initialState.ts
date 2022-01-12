import { defaultSettings, getCurrentDBConfig } from '@database';
import { LSKeys } from '@types';

import { deMarshallState, marshallState } from '../DataManager/utils';
import { ClaimsState } from './claims.slice';
import { ConnectionsState } from './connections.slice';
import { PromoPoapsState } from './promoPoaps.slice';

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
  [LSKeys.USER_ACTIONS]: [],
  [LSKeys.PROMO_POAPS]: { promos: {} } as PromoPoapsState,
  [LSKeys.CONNECTIONS]: { wallets: {} } as ConnectionsState,
  [LSKeys.CLAIMS]: { claims: {} } as ClaimsState
};
/**
 * @todo migrate to new store structure once redux-persist is in setup.
 * The initial state is the equivalent of `marshallState(getCurrentDBConfig().defaultValues)`
 * We redeclare it here to avoid circular dep issues and changing multiple imports.
 * Will be changed once we refactor to slices.
 */
export const initialLegacyState = marshallState(deMarshallState(emptyState));
