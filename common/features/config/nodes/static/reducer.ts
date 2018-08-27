import { NODE_CONFIGS } from 'libs/nodes';
import { NodeAction } from '../../types';
import * as types from './types';
import { makeStateFromNodeConfigs } from './helpers';

export const CONFIG_STATIC_NODES_INITIAL_STATE: types.ConfigStaticNodesState = Object.keys(
  NODE_CONFIGS
).reduce(makeStateFromNodeConfigs, {});

export function staticNodesReducer(
  state: types.ConfigStaticNodesState = CONFIG_STATIC_NODES_INITIAL_STATE,
  action: NodeAction
) {
  switch (action.type) {
    case types.ConfigStaticNodesActions.WEB3_SET:
      return { ...state, [action.payload.id]: action.payload.config };
    case types.ConfigStaticNodesActions.WEB3_UNSET:
      const stateCopy = { ...state };
      Reflect.deleteProperty(stateCopy, 'web3');
      return stateCopy;
    default:
      return state;
  }
}
