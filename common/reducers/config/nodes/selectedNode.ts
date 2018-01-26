import { ChangeNodeAction, ChangeNodeIntentAction, NodeAction, TypeKeys } from 'actions/config';

interface NodeLoaded {
  pending: false;
  nodeName: string;
}

interface NodeChangePending {
  pending: true;
  nodeName: null;
}

export type State = NodeLoaded | NodeChangePending;

export const INITIAL_STATE: NodeLoaded = {
  nodeName: 'eth_mew',
  pending: false
};

const changeNode = (_: State, { payload }: ChangeNodeAction): State => ({
  nodeName: payload.networkName,
  pending: false
});

const changeNodeIntent = (_: State, _2: ChangeNodeIntentAction): State => ({
  nodeName: null,
  pending: true
});

export const selectedNode = (state: State = INITIAL_STATE, action: NodeAction) => {
  switch (action.type) {
    case TypeKeys.CONFIG_NODE_CHANGE:
      return changeNode(state, action);
    case TypeKeys.CONFIG_NODE_CHANGE_INTENT:
      return changeNodeIntent(state, action);
    default:
      return state;
  }
};
