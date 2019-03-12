import { makeAutoNodeName } from 'libs/nodes';
import * as types from './types';

export const SELECTED_NODE_INITIAL_STATE: types.ConfigNodesSelectedState = {
  nodeId: makeAutoNodeName('ETH'),
  prevNode: makeAutoNodeName('ETH'),
  pending: false
};

const changeNodeRequested = (
  state: types.ConfigNodesSelectedState,
  _: types.ChangeNodeRequestedAction
): types.ConfigNodesSelectedState => ({
  ...state,
  pending: true
});

const changeNodeSucceeded = (
  state: types.ConfigNodesSelectedState,
  { payload }: types.ChangeNodeSucceededAction
): types.ConfigNodesSelectedState => ({
  nodeId: payload.nodeId,
  // make sure we dont accidentally switch back to a web3 node
  prevNode: state.nodeId === 'web3' ? state.prevNode : state.nodeId,
  pending: false
});

const changeNodeFailed = (
  state: types.ConfigNodesSelectedState
): types.ConfigNodesSelectedState => ({
  ...state,
  pending: false
});

export const selectedNodeReducer = (
  state: types.ConfigNodesSelectedState = SELECTED_NODE_INITIAL_STATE,
  action: types.SelectedNodeAction
) => {
  switch (action.type) {
    case types.ConfigNodesSelectedActions.CHANGE_SUCCEEDED:
      return changeNodeSucceeded(state, action);
    case types.ConfigNodesSelectedActions.CHANGE_REQUESTED:
      return changeNodeRequested(state, action);
    case types.ConfigNodesSelectedActions.CHANGE_FAILED:
      return changeNodeFailed(state);
    default:
      return state;
  }
};
