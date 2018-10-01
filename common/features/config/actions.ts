import * as types from './types';

export type TPollOfflineStatus = typeof pollOfflineStatus;
export function pollOfflineStatus(): types.PollOfflineStatus {
  return {
    type: types.ConfigActions.POLL_OFFLINE_STATUS
  };
}
