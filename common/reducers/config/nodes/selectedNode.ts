import {
  ChangeNodeRequestedAction,
  ChangeNodeSucceededAction,
  NodeAction,
  TypeKeys,
  CustomNodeAction
} from 'actions/config';
import { makeAutoNodeName } from 'libs/nodes';
import { SelectedNodeState as State } from './types';

export const INITIAL_STATE: State = {
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

export const selectedNode = (
  state: State = INITIAL_STATE,
  action: NodeAction | CustomNodeAction
) => {
  switch (action.type) {
    case TypeKeys.CONFIG_CHANGE_NODE_SUCCEEDED:
      return changeNodeSucceeded(state, action);
    case TypeKeys.CONFIG_CHANGE_NODE_REQUESTED:
      return changeNodeRequested(state, action);
    case TypeKeys.CONFIG_CHANGE_NODE_FAILED:
      return changeNodeFailed(state);
    default:
      return state;
  }
};
