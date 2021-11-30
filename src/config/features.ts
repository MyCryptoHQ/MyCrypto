import { IS_DEV } from '@utils/environment';

/**
 * We use 'core' to distinguish between the permanent features
 * and the ones that we want to toggle with DevTools.
 *
 */
export const FEATURE_FLAGS = {
  DASHBOARD: 'core',
  BUY: 'core',
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
  DEFIZAP: false,

  /* Tools */
  BROADCAST_TX: 'core',
  CONTRACT_INTERACT: 'core',
  CONTRACT_DEPLOY: 'core',
  SIGN_MESSAGE: 'core',
  VERIFY_MESSAGE: 'core',

  /* Product Tools */
  ANALYTICS: 'core',

  /* Misc */
  PRIVATE_TAGS: true,
  PROTECT_TX: true,
  ENS: true,
  CUSTOM_NETWORKS: IS_DEV,
  FAUCET: true
};
