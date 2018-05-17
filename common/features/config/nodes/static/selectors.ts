import { StaticNodeId } from 'types/node';
import { AppState } from 'features/reducers';
import { getNodes } from '../derivedSelectors';

export function getStaticNodes(state: AppState) {
  return getNodes(state).staticNodes;
}

export function getStaticNodeConfigs(state: AppState) {
  return getNodes(state).staticNodes;
}

export const getStaticNodeConfig = (state: AppState) => {
  const { staticNodes, selectedNode: { nodeId } } = getNodes(state);

  const defaultNetwork = isStaticNodeId(state, nodeId) ? staticNodes[nodeId] : undefined;
  return defaultNetwork;
};

export function isStaticNodeId(state: AppState, nodeId: string): nodeId is StaticNodeId {
  return Object.keys(getStaticNodeConfigs(state)).includes(nodeId);
}
