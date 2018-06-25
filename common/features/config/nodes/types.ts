import { CustomNodesState } from './custom/types';
import { StaticNodesState } from './static/types';
import { SelectedNodeState } from './selected/types';

export interface NodesState {
  customNodes: CustomNodesState;
  staticNodes: StaticNodesState;
  selectedNode: SelectedNodeState;
}
