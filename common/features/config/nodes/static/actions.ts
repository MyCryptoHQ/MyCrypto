import * as types from './types';

export function web3SetNode(payload: types.Web3setNodeAction['payload']): types.Web3setNodeAction {
  return {
    type: types.ConfigStaticNodesActions.WEB3_SET,
    payload
  };
}

export type TWeb3UnsetNode = typeof web3UnsetNode;
export function web3UnsetNode(): types.Web3UnsetNodeAction {
  return {
    type: types.ConfigStaticNodesActions.WEB3_UNSET
  };
}
