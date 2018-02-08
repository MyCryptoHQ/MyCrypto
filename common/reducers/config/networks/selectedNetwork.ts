import { NodeAction, TypeKeys, ChangeNodeAction } from 'actions/config';
import { INITIAL_STATE as INITIAL_NODE_STATE } from '../nodes/selectedNode';
import { INITIAL_STATE as INITIAL_DEFAULT_NODE_STATE } from '../nodes/staticNodes';
import { NonWeb3NodeConfigs } from 'types/node';
import { StaticNetworkIds } from 'types/network';

const initalNode =
  INITIAL_DEFAULT_NODE_STATE[INITIAL_NODE_STATE.nodeId as keyof NonWeb3NodeConfigs];

export type State = string | StaticNetworkIds;

const INITIAL_STATE: State = initalNode.network;

const handleNodeChange = (_: State, { payload }: ChangeNodeAction) => payload.networkId;

export const selectedNetwork = (state: State = INITIAL_STATE, action: NodeAction) => {
  switch (action.type) {
    case TypeKeys.CONFIG_NODE_CHANGE:
      return handleNodeChange(state, action);
    default:
      return state;
  }
};
