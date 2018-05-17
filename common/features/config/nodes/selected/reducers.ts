import {
  TypeKeys,
  NodeAction,
  CustomNodeAction,
  ChangeNodeAction,
  ChangeNodeIntentAction,
  RemoveCustomNodeAction
} from '../../types';

interface NodeLoaded {
  pending: false;
  prevNode: string;
  nodeId: string;
}

interface NodeChangePending {
  pending: true;
  prevNode: string;
  nodeId: string;
}

export type SelectedNodeState = NodeLoaded | NodeChangePending;

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

export default function selectedNodes(
  state: SelectedNodeState = SELECTED_NODE_INITIAL_STATE,
  action: NodeAction | CustomNodeAction
) {
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
}
