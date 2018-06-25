import { NODE_CONFIGS, makeAutoNodeName } from 'libs/nodes';
import { RawNodeConfig } from 'types/node';
import { StaticNetworkIds } from 'types/network';
import { StaticNodesState } from './types';

export function makeStateFromNodeConfigs(
  prev: Partial<StaticNodesState>,
  network: StaticNetworkIds
) {
  // Auto network
  const autoId = makeAutoNodeName(network);
  prev[autoId] = {
    network,
    id: autoId,
    isAuto: true,
    isCustom: false,
    service: 'AUTO'
  };

  // Static networks
  NODE_CONFIGS[network].forEach((config: RawNodeConfig) => {
    prev[config.name] = {
      network,
      id: config.name,
      isCustom: false,
      service: config.service
    };
  });

  return prev;
}
