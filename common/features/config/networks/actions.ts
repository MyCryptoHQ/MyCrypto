import * as types from './types';

export type TChangeNetworkRequested = typeof changeNetworkRequested;
export function changeNetworkRequested(
  payload: types.ChangeNetworkRequestedAction['payload']
): types.ChangeNetworkRequestedAction {
  return {
    type: types.ConfigNetworksActions.CHANGE_NETWORK_REQUESTED,
    payload
  };
}
