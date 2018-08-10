import { NODE_CONFIGS } from 'libs/nodes';
import { NodeAction } from '../../types';
import { CONFIG_NODES_STATIC, StaticNodesState } from './types';
import { makeStateFromNodeConfigs } from './helpers';

export const STATIC_NODES_INITIAL_STATE: StaticNodesState = Object.keys(NODE_CONFIGS).reduce(
  makeStateFromNodeConfigs,
  {}
);

export function staticNodesReducer(
  state: StaticNodesState = STATIC_NODES_INITIAL_STATE,
  action: NodeAction
) {
  switch (action.type) {
    case CONFIG_NODES_STATIC.WEB3_SET:
      return { ...state, [action.payload.id]: action.payload.config };
    case CONFIG_NODES_STATIC.WEB3_UNSET:
      const stateCopy = { ...state };
      Reflect.deleteProperty(stateCopy, 'web3');
      return stateCopy;
    default:
      return state;
  }
}
