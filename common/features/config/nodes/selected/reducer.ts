import { makeAutoNodeName } from 'libs/nodes';
import {
  CONFIG_NODES_SELECTED,
  SelectedNodeState as State,
  SelectedNodeAction,
  ChangeNodeRequestedAction,
  ChangeNodeSucceededAction
} from './types';

export const SELECTED_NODE_INITIAL_STATE: State = {
  nodeId: makeAutoNodeName('ETH'),
  prevNode: makeAutoNodeName('ETH'),
  pending: false
};

const changeNodeRequested = (state: State, _: ChangeNodeRequestedAction): State => ({
  ...state,
  pending: true
});

const changeNodeSucceeded = (state: State, { payload }: ChangeNodeSucceededAction): State => ({
  nodeId: payload.nodeId,
  // make sure we dont accidentally switch back to a web3 node
  prevNode: state.nodeId === 'web3' ? state.prevNode : state.nodeId,
  pending: false
});

const changeNodeFailed = (state: State): State => ({
  ...state,
  pending: false
});

export const selectedNodeReducer = (
  state: State = SELECTED_NODE_INITIAL_STATE,
  action: SelectedNodeAction
) => {
  switch (action.type) {
    case CONFIG_NODES_SELECTED.CHANGE_SUCCEEDED:
      return changeNodeSucceeded(state, action);
    case CONFIG_NODES_SELECTED.CHANGE_REQUESTED:
      return changeNodeRequested(state, action);
    case CONFIG_NODES_SELECTED.CHANGE_FAILED:
      return changeNodeFailed(state);
    default:
      return state;
  }
};
