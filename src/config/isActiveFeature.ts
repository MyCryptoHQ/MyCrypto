import { IS_DEV } from '@utils';

export enum FEATURE_LIST {
  DASHBOARD = 'DASHBOARD',
  BUY = 'BUY',
  SEND_ASSETS = 'SEND_ASSETS',
  BROADCAST_TX = 'BROADCAST_TX',
  ADD_ACCOUNT = 'ADD_ACCOUNT',
  CONTRACT_INTERACT = 'CONTRACT_INTERACT',
  CONTRACT_DEPLOY = 'CONTRACT_DEPLOY',
  SIGN_MESSAGE = 'SIGN_MESSAGE',
  VERIFY_MESSAGE = 'VERIFY_MESSAGE',
  TX_HISTORY = 'TX_HISTORY',
  REQUEST_ASSETS = 'REQUEST_ASSETS',
  CREATE_WALLET = 'CREATE_WALLET',
  SCREEN_LOCK = 'SCREEN_LOCK',
  SETTINGS = 'SETTINGS',
  SWAP = 'SWAP',
  DOWNLOAD_DESKTOP_APP = 'DOWNLOAD_DESKTOP_APP',
  PRIVATE_TAGS = 'PRIVATE_TAGS',
  DEFIZAP = 'DEFIZAP',
  MYC_MEMBERSHIP = 'MYC_MEMBERSHIP',
  PROTECT_TX = 'PROTECT_TX',
  ENS = 'ENS',
  CUSTOM_NETWORKS = 'CUSTOM_NETWORKS',
  TX_STATUS = 'TX_STATUS',
  REP_TOKEN_MIGRATION = 'REP_TOKEN_MIGRATION',
  MIGRATE_LS = 'MIGRATE_LS'
}

export type IIS_ACTIVE_FEATURE = {
  readonly [k in FEATURE_LIST]: boolean;
};

export const IS_ACTIVE_FEATURE: IIS_ACTIVE_FEATURE = {
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
