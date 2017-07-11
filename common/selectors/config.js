// @flow
import type { State } from 'reducers';
import { BaseNode } from 'libs/nodes';
import { NODES, NETWORKS } from 'config/data';
import type { NetworkConfig } from 'config/data';

export function getNodeLib(state: State): BaseNode {
  return NODES[state.config.nodeSelection].lib;
}

export function getNetworkConfig(state: State): NetworkConfig {
  return NETWORKS[NODES[state.config.nodeSelection].network];
}
