import { StaticNetworkIds } from 'types/network';
import * as types from './types';

export function makeStateFromNodeConfigs(
  prev: Partial<types.ConfigStaticNodesState>,
  network: StaticNetworkIds
) {
  // Auto network
  const autoId = 'ETH';
  prev[autoId] = {
    network,
    id: autoId,
    isAuto: true,
    isCustom: false,
    service: 'AUTO'
  };

  return prev;
}
