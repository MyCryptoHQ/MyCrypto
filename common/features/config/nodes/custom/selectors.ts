import { CustomNodeConfig } from 'types/node';
import { AppState } from 'features/reducers';

function getNodes(state: AppState) {
  return state.config.nodes;
}

export function getCustomNodeConfigs(state: AppState) {
  return getNodes(state).customNodes;
}

export const getCustomNodeConfig = (state: AppState): CustomNodeConfig | undefined => {
  const {
    customNodes,
    selectedNode: { nodeId }
  } = getNodes(state);

  const customNode = customNodes[nodeId];
  return customNode;
};

export function isNodeCustom(state: AppState, nodeId: string): CustomNodeConfig | undefined {
  return getCustomNodeConfigs(state)[nodeId];
}

export const getCustomNodeFromId = (
  state: AppState,
  nodeId: string
): CustomNodeConfig | undefined => getCustomNodeConfigs(state)[nodeId];
