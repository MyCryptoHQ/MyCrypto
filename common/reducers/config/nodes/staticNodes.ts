import { TypeKeys, NodeAction } from 'actions/config';
import { NODE_CONFIGS, makeAutoNodeName } from 'libs/nodes';
import { StaticNodesState } from './types';
import { RawNodeConfig } from 'types/node';
import { StaticNetworkIds } from 'types/network';

function makeStateFromNodeConfigs(prev: Partial<StaticNodesState>, network: StaticNetworkIds) {
  // Auto network
  prev[makeAutoNodeName(network)] = {
    network,
    isAuto: true,
    isCustom: false,
    service: 'AUTO',
    estimateGas: NODE_CONFIGS[network].reduce((bool, node) => bool || node.estimateGas, false)
  };

  // Static networks
  NODE_CONFIGS[network].forEach((config: RawNodeConfig) => {
    prev[config.name] = {
      network,
      isCustom: false,
      service: config.service,
      estimateGas: config.estimateGas
    };
  });

  return prev;
}

export const INITIAL_STATE: StaticNodesState = Object.keys(NODE_CONFIGS).reduce(
  makeStateFromNodeConfigs,
  {}
);

const staticNodes = (state: StaticNodesState = INITIAL_STATE, action: NodeAction) => {
  switch (action.type) {
    case TypeKeys.CONFIG_NODE_WEB3_SET:
      return { ...state, [action.payload.id]: action.payload.config };
    case TypeKeys.CONFIG_NODE_WEB3_UNSET:
      const stateCopy = { ...state };
      Reflect.deleteProperty(stateCopy, 'web3');
      return stateCopy;
    default:
      return state;
  }
};

export { StaticNodesState, staticNodes };
