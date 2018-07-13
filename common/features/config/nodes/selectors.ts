import { shepherdProvider, INode } from 'libs/nodes';
import { CustomNodeConfig, StaticNodeConfig } from 'types/node';
import { AppState } from 'features/reducers';
import * as configNodesCustomSelectors from './custom/selectors';
import * as configNodesSelectedSelectors from './selected/selectors';
import * as configNodesStaticSelectors from './static/selectors';

function getConfig(state: AppState) {
  return state.config;
}

export function getNodes(state: AppState) {
  return getConfig(state).nodes;
}

export const getWeb3Node = (state: AppState): StaticNodeConfig | null => {
  const isWeb3Node = (nodeId: string) => nodeId === 'web3';
  const currNode = configNodesStaticSelectors.getStaticNodeConfig(state);
  const currNodeId = configNodesSelectedSelectors.getNodeId(state);
  if (currNode && currNodeId && isWeb3Node(currNodeId)) {
    return currNode;
  }
  return null;
};

export function getIsWeb3Node(state: AppState): boolean {
  return configNodesSelectedSelectors.getNodeId(state) === 'web3';
}

export function getNodeLib(_: AppState): INode {
  return shepherdProvider;
}

export function getNodeConfig(state: AppState): StaticNodeConfig | CustomNodeConfig {
  const config =
    configNodesStaticSelectors.getStaticNodeConfig(state) ||
    configNodesCustomSelectors.getCustomNodeConfig(state);

  if (!config) {
    const { selectedNode } = getNodes(state);
    throw Error(`No node config found for ${selectedNode.nodeId} in either static or custom nodes`);
  }
  return config;
}
