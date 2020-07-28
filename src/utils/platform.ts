export const IS_ELECTRON: boolean = process.env.TARGET_ENV === 'electron';
export const USE_HASH_ROUTER: boolean =
  process.env.TARGET_ENV === 'electron' || process.env.TARGET_ENV === 'staging';
