import {
  SelectedNodeState,
  ChangeNodeAction,
  ChangeNodeIntentAction,
  CONFIG_NODES_SELECTED
} from './types';
import { RemoveCustomNodeAction, CONFIG_NODES_CUSTOM, CustomNodeAction } from '../custom/types';
import { NodeAction } from 'features/config';

export const SELECTED_NODE_INITIAL_STATE: SelectedNodeState = {
  nodeId: 'eth_auto',
  prevNode: 'eth_auto',
  pending: false
};

const changeNode = (
  state: SelectedNodeState,
  { payload }: ChangeNodeAction
): SelectedNodeState => ({
  nodeId: payload.nodeId,
  // make sure we dont accidentally switch back to a web3 node
  prevNode: state.nodeId === 'web3' ? state.prevNode : state.nodeId,
  pending: false
});

const changeNodeIntent = (
  state: SelectedNodeState,
  _: ChangeNodeIntentAction
): SelectedNodeState => ({
  ...state,
  pending: true
});

const handleRemoveCustomNode = (
  _: SelectedNodeState,
  _1: RemoveCustomNodeAction
): SelectedNodeState => SELECTED_NODE_INITIAL_STATE;

export function selectedNodesReducer(
  state: SelectedNodeState = SELECTED_NODE_INITIAL_STATE,
  action: NodeAction | CustomNodeAction
) {
  switch (action.type) {
    case CONFIG_NODES_SELECTED.CHANGE:
      return changeNode(state, action);
    case CONFIG_NODES_SELECTED.CHANGE_INTENT:
      return changeNodeIntent(state, action);
    case CONFIG_NODES_CUSTOM.REMOVE:
      return handleRemoveCustomNode(state, action);
    default:
      return state;
  }
}
