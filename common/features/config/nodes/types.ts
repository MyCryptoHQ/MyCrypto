import * as configNodesCustomTypes from './custom/types';
import * as configNodesStaticTypes from './static/types';
import * as configNodesSelectedTypes from './selected/types';

export interface ConfigNodesState {
  customNodes: configNodesCustomTypes.ConfigCustomNodesState;
  staticNodes: configNodesStaticTypes.ConfigStaticNodesState;
  selectedNode: configNodesSelectedTypes.ConfigNodesSelectedState;
}
