import {
  ChangeNodeAction,
  ChangeNodeIntentAction,
  NodeAction,
  TypeKeys,
  RemoveCustomNodeAction,
  CustomNodeAction
} from 'actions/config';
import { SelectedNodeState as State } from './types';

export const INITIAL_STATE: State = {
  nodeId: 'eth_mycrypto',
  pending: false
};

const changeNode = (_: State, { payload }: ChangeNodeAction): State => ({
  nodeId: payload.nodeId,
  pending: false
});

const changeNodeIntent = (state: State, _: ChangeNodeIntentAction): State => ({
  ...state,
  pending: true
});

const handleRemoveCustomNode = (_: State, _1: RemoveCustomNodeAction): State => INITIAL_STATE;

export const selectedNode = (
  state: State = INITIAL_STATE,
  action: NodeAction | CustomNodeAction
) => {
  switch (action.type) {
    case TypeKeys.CONFIG_NODE_CHANGE:
      return changeNode(state, action);
    case TypeKeys.CONFIG_NODE_CHANGE_INTENT:
      return changeNodeIntent(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NODE:
      return handleRemoveCustomNode(state, action);
    default:
      return state;
  }
};
