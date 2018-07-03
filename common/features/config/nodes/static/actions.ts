import { Web3setNodeAction, CONFIG_NODES_STATIC, Web3UnsetNodeAction } from './types';

export function web3SetNode(payload: Web3setNodeAction['payload']): Web3setNodeAction {
  return {
    type: CONFIG_NODES_STATIC.WEB3_SET,
    payload
  };
}

export type TWeb3UnsetNode = typeof web3UnsetNode;
export function web3UnsetNode(): Web3UnsetNodeAction {
  return {
    type: CONFIG_NODES_STATIC.WEB3_UNSET
  };
}
