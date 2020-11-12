import { addNodesToNetworks } from './helpers';
import { NETWORKS_CONFIG } from './networks';
import { NODES_CONFIG } from './nodes';

export { SCHEMA_BASE } from './schema';
export { defaultContacts } from './contacts';
export { defaultSettings } from './settings';

export { CONTRACTS } from './contracts';
export const NETWORKS = addNodesToNetworks(NETWORKS_CONFIG, NODES_CONFIG);
