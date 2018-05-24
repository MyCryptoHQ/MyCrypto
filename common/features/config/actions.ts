import {
  CONFIG,
  PollOfflineStatus,
  ChangeNodeIntentOneTimeAction,
  ChangeNodeForceAction
} from './types';

export type TPollOfflineStatus = typeof pollOfflineStatus;
export function pollOfflineStatus(): PollOfflineStatus {
  return {
    type: CONFIG.POLL_OFFLINE_STATUS
  };
}

export type TChangeNodeIntentOneTime = typeof changeNodeIntentOneTime;
export function changeNodeIntentOneTime(payload: string): ChangeNodeIntentOneTimeAction {
  return {
    type: CONFIG.NODE_CHANGE_INTENT_ONETIME,
    payload
  };
}

export type TChangeNodeForce = typeof changeNodeForce;
export function changeNodeForce(payload: string): ChangeNodeForceAction {
  return {
    type: CONFIG.NODE_CHANGE_FORCE,
    payload
  };
}
