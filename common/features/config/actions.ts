import { CONFIG, PollOfflineStatus } from './types';

export type TPollOfflineStatus = typeof pollOfflineStatus;
export function pollOfflineStatus(): PollOfflineStatus {
  return {
    type: CONFIG.POLL_OFFLINE_STATUS
  };
}
