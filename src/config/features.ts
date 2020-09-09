import { IS_DEV } from '@utils';

export type IFeatures = typeof FEATURE_FLAGS;

export const FEATURE_FLAGS = {
  DASHBOARD: true,
  BUY: true,
  SEND_ASSETS: true,
  BROADCAST_TX: true,
  ADD_ACCOUNT: true,
  CONTRACT_INTERACT: true,
  CONTRACT_DEPLOY: true,
  SIGN_MESSAGE: true,
  VERIFY_MESSAGE: true,
  TX_HISTORY: true,
  REQUEST_ASSETS: true,
  CREATE_WALLET: true,
  SCREEN_LOCK: true,
  SETTINGS: true,
  SWAP: true,
  DOWNLOAD_DESKTOP_APP: true,
  PRIVATE_TAGS: true,
  DEFIZAP: true,
  MYC_MEMBERSHIP: true,
  PROTECT_TX: true,
  ENS: true,
  CUSTOM_NETWORKS: IS_DEV,
  TX_STATUS: true,
  REP_TOKEN_MIGRATION: true,
  // This features requires a landing page, same root host to be running simultaneously.
  // While this can be expected in staging and in production we SHOULD not expect every developper
  // to run both projects while working. Deactivate feature in dev by default.
  MIGRATE_LS: !IS_DEV
};
