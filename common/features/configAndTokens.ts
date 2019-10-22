import { dedupeCustomTokens } from 'utils/tokens';
import { loadStatePropertyOrEmptyObject } from 'utils/localStorage';
import { CustomNodeConfig } from 'types/node';
import { shepherd, makeProviderConfig } from 'libs/nodes';
import RootReducer, { AppState } from './reducers';
import { getLanguageSelection, getTheme } from './config/meta/selectors';
import { getCustomNetworkConfigs } from './config/networks/custom/selectors';
import { isStaticNetworkId } from './config/networks/static/selectors';
import { isStaticNodeId } from './config/nodes/static/selectors';
import { getCustomNodeConfigs } from './config/nodes/custom/selectors';
import { getSelectedNode } from './config/nodes/selected/selectors';
import { ConfigState } from './config/types';
import { configReducer } from './config/reducer';
import { CustomTokensState } from './customTokens/types';
import { INITIAL_STATE as customTokensInitialState } from './customTokens/reducer';

const appInitialState = RootReducer(undefined as any, { type: 'inital_state' });

type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
export function getConfigAndCustomTokensStateToSubscribe(
  state: AppState
): Pick<DeepPartial<AppState>, 'config' | 'customTokens'> {
  const subscribedConfig: DeepPartial<ConfigState> = {
    meta: {
      languageSelection: getLanguageSelection(state),
      theme: getTheme(state)
    },
    nodes: { customNodes: getCustomNodeConfigs(state), selectedNode: getSelectedNode(state) },
    networks: {
      customNetworks: getCustomNetworkConfigs(state)
    }
  };

  const subscribedTokens = state.customTokens;

  return { config: subscribedConfig, customTokens: subscribedTokens };
}

export function rehydrateConfigAndCustomTokenState() {
  const configInitialState = configReducer(undefined as any, { type: 'inital_state' });
  const savedConfigState = loadStatePropertyOrEmptyObject<ConfigState>('config');
  const nextConfigState = { ...configInitialState };

  // If they have a saved node, make sure we assign that too. The node selected
  // isn't serializable, so we have to assign it here.
  if (savedConfigState) {
    // we assign networks first so that when we re-hydrate custom nodes, we can check that the network exists
    nextConfigState.networks = rehydrateNetworks(
      configInitialState.networks,
      savedConfigState.networks
    );
    nextConfigState.nodes = rehydrateNodes(
      configInitialState.nodes,
      savedConfigState.nodes,
      nextConfigState.networks
    );
    nextConfigState.meta = { ...nextConfigState.meta, ...savedConfigState.meta };
  }

  const {
    customNodes,
    selectedNode: { nodeId },
    staticNodes
  } = nextConfigState.nodes;
  const selectedNode = isStaticNodeId(appInitialState, nodeId)
    ? staticNodes[nodeId]
    : customNodes[nodeId];

  if (!selectedNode) {
    return { config: configInitialState, customTokens: customTokensInitialState };
  }

  const nextCustomTokenState = rehydrateCustomTokens(
    nextConfigState.networks,
    selectedNode.network
  );

  return { config: nextConfigState, customTokens: nextCustomTokenState };
}

function rehydrateCustomTokens(networkState: ConfigState['networks'], selectedNetwork: string) {
  // Dedupe custom tokens initially
  const savedCustomTokensState =
    loadStatePropertyOrEmptyObject<CustomTokensState>('customTokens') || customTokensInitialState;

  const { customNetworks, staticNetworks } = networkState;
  const network = isStaticNetworkId(appInitialState, selectedNetwork)
    ? staticNetworks[selectedNetwork]
    : customNetworks[selectedNetwork];

  return network.isCustom
    ? savedCustomTokensState
    : dedupeCustomTokens(network.tokens, savedCustomTokensState);
}

function rehydrateNetworks(
  initialState: ConfigState['networks'],
  savedState: ConfigState['networks']
): ConfigState['networks'] {
  const nextNetworkState = { ...initialState };
  nextNetworkState.customNetworks = savedState.customNetworks;
  return nextNetworkState;
}

function rehydrateNodes(
  initalState: ConfigState['nodes'],
  savedState: ConfigState['nodes'],
  networkState: ConfigState['networks']
): ConfigState['nodes'] {
  const nextNodeState = { ...initalState };

  // re-assign the hydrated nodes
  nextNodeState.customNodes = rehydrateCustomNodes(savedState.customNodes, networkState);
  const { customNodes, staticNodes } = nextNodeState;
  nextNodeState.selectedNode = getSavedSelectedNode(
    nextNodeState.selectedNode,
    savedState.selectedNode,
    customNodes,
    staticNodes
  );

  return nextNodeState;
}

function getSavedSelectedNode(
  initialState: ConfigState['nodes']['selectedNode'],
  savedState: ConfigState['nodes']['selectedNode'],
  customNodes: ConfigState['nodes']['customNodes'],
  staticNodes: ConfigState['nodes']['staticNodes']
): ConfigState['nodes']['selectedNode'] {
  const { nodeId: savedNodeId } = savedState;

  // if 'web3' has persisted as node selection, reset to app default
  // necessary because web3 is only initialized as a node upon MetaMask / Web3 unlock

  if (savedNodeId === 'web3') {
    return { nodeId: initialState.nodeId, prevNode: initialState.nodeId, pending: false };
  }

  const nodeConfigExists = isStaticNodeId(appInitialState, savedNodeId)
    ? staticNodes[savedNodeId]
    : customNodes[savedNodeId];

  const nodeId = nodeConfigExists ? savedNodeId : initialState.nodeId;
  return { nodeId, prevNode: nodeId, pending: false };
}

function rehydrateCustomNodes(
  state: ConfigState['nodes']['customNodes'],
  networkState: ConfigState['networks']
) {
  const networkExists = (networkId: string) =>
    Object.keys(networkState.customNetworks).includes(networkId) ||
    Object.keys(networkState.staticNetworks).includes(networkId);

  const rehydratedCustomNodes = Object.entries(state).reduce(
    (hydratedNodes, [customNodeId, configToHydrate]) => {
      if (!networkExists(configToHydrate.network)) {
        return hydratedNodes;
      }

      shepherd.useProvider(
        'myccustom',
        configToHydrate.id,
        makeProviderConfig({ network: configToHydrate.network }),
        configToHydrate
      );

      const hydratedNode: CustomNodeConfig = { ...configToHydrate };
      return { ...hydratedNodes, [customNodeId]: hydratedNode };
    },
    {} as ConfigState['nodes']['customNodes']
  );
  return rehydratedCustomNodes;
}
