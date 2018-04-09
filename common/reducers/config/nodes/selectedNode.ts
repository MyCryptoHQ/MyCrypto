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
  nodeId: 'eth_auto',
  prevNode: 'eth_auto',
  pending: false
};

const changeNode = (state: State, { payload }: ChangeNodeAction): State => ({
  nodeId: payload.nodeId,
  // make sure we dont accidentally switch back to a web3 node
  prevNode: state.nodeId === 'web3' ? state.prevNode : state.nodeId,
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
