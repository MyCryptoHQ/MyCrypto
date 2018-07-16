import { CONFIG_NETWORKS, ChangeNetworkRequestedAction } from './types';

export type TChangeNetworkRequested = typeof changeNetworkRequested;
export function changeNetworkRequested(
  payload: ChangeNetworkRequestedAction['payload']
): ChangeNetworkRequestedAction {
  return {
    type: CONFIG_NETWORKS.CHANGE_NETWORK_REQUESTED,
    payload
  };
}
