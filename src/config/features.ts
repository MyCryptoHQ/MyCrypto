import { IS_DEV } from '@utils';

export type IFeatureFlags = typeof FEATURE_FLAGS;

/**
 * We use 'core' to distinguish between the permanent features
 * and the ones that we want to toggle with DevTools.
 *
 */
export const FEATURE_FLAGS = {
  DASHBOARD: 'core',
  BUY: 'core',
  SCREEN_LOCK: 'core',
  SETTINGS: 'core',
  TX_HISTORY: 'core',
  MYC_MEMBERSHIP: 'core',
  DOWNLOAD_DESKTOP_APP: 'core',

  /* Manage Assets */
  ADD_ACCOUNT: 'core',
  SEND_ASSETS: 'core',
  REQUEST_ASSETS: 'core',
  CREATE_WALLET: 'core',
  SWAP: 'core',
  TX_STATUS: 'core',
  DEFIZAP: 'core',

  /* Tools */
  BROADCAST_TX: 'core',
  CONTRACT_INTERACT: 'core',
  CONTRACT_DEPLOY: 'core',
  SIGN_MESSAGE: 'core',
  VERIFY_MESSAGE: 'core',

  /* Misc */
  PRIVATE_TAGS: true,
  PROTECT_TX: true,
  ENS: true,
  REP_TOKEN_MIGRATION: true,
  CUSTOM_NETWORKS: IS_DEV,
  // This features requires a landing page, same root host to be running simultaneously.
  // While this can be expected in staging and in production we SHOULD not expect every developper
  // to run both projects while working. Deactivate feature in dev by default.
  MIGRATE_LS: !IS_DEV
};
