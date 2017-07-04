// @flow
import type { State } from 'reducers';
import { BaseNode } from 'libs/nodes';
import { NODES } from 'config/data';

export function getNodeLib(state: State): BaseNode {
    return NODES[state.config.nodeSelection].lib;
}
