import { Network } from '@types';
import { mapObjIndexed } from '@vendor';

import { NETWORKS_CONFIG } from './networks';
import { NODES_CONFIG } from './nodes';

export const addNodesToNetworks = (
  networks: typeof NETWORKS_CONFIG,
  nodes: typeof NODES_CONFIG
) => {
  const addNodes = (n: Network): Network => ({
    ...n,
    nodes: nodes[n.id],
    autoNode: nodes[n.id][0].name || undefined,
    selectedNode: nodes[n.id][0].name || undefined
  });
  return mapObjIndexed(addNodes, networks);
};
