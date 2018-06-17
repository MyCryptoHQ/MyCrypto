import { delay, SagaIterator } from 'redux-saga';
import { call, fork, put, take, takeEvery, select, apply, all } from 'redux-saga/effects';

import { translateRaw } from 'translations';
import { StaticNodeConfig, CustomNodeConfig, NodeConfig } from 'types/node';
import { CustomNetworkConfig, StaticNetworkConfig } from 'types/network';
import {
  isAutoNode,
  shepherd,
  shepherdProvider,
  stripWeb3Network,
  makeProviderConfig,
  getShepherdNetwork,
  makeAutoNodeName,
  makeWeb3Network,
  getShepherdManualMode
} from 'libs/nodes';
import { Web3Wallet } from 'libs/wallet';
import { setupWeb3Node, Web3Service, isWeb3Node } from 'libs/nodes/web3';
import { AppState } from 'features/reducers';
import { showNotification } from 'features/notifications/actions';
import * as walletTypes from 'features/wallet/types';
import { resetWallet, setWallet } from 'features/wallet/actions';
import { CONFIG_META } from './meta/types';
import { setLatestBlock } from './meta/actions';
import { getOffline } from './meta/selectors';
import { CONFIG_NETWORKS, ChangeNetworkRequestedAction } from './networks/types';
import { getNetworkConfigById, getNetworkByChainId } from './networks/selectors';
import { CONFIG_NETWORKS_CUSTOM } from './networks/custom/types';
import { removeCustomNetwork } from './networks/custom/actions';
import { getCustomNetworkConfigs } from './networks/custom/selectors';
import { getNodeConfig, getWeb3Node } from './nodes/selectors';
import {
  CONFIG_NODES_CUSTOM,
  AddCustomNodeAction,
  RemoveCustomNodeAction
} from './nodes/custom/types';
import { getCustomNodeFromId, getCustomNodeConfigs } from './nodes/custom/selectors';
import {
  CONFIG_NODES_SELECTED,
  ChangeNodeForceAction,
  ChangeNodeRequestedAction,
  ChangeNodeRequestedOneTimeAction
} from './nodes/selected/types';
import {
  changeNodeRequested,
  changeNodeSucceeded,
  changeNodeFailed,
  changeNodeForce
} from './nodes/selected/actions';
import { SELECTED_NODE_INITIAL_STATE } from './nodes/selected/reducer';
import { getNodeId, getPreviouslySelectedNode } from './nodes/selected/selectors';
import { CONFIG_NODES_STATIC } from './nodes/static/types';
import { web3SetNode, web3UnsetNode } from './nodes/static/actions';
import { isStaticNodeId } from './nodes/static/selectors';
import { getAllNodes, getStaticNodeFromId } from './selectors';

//#region Network
// If there are any orphaned custom networks, prune them
export function* pruneCustomNetworks(): SagaIterator {
  const customNodes: AppState['config']['nodes']['customNodes'] = yield select(
    getCustomNodeConfigs
  );
  const customNetworks: AppState['config']['networks']['customNetworks'] = yield select(
    getCustomNetworkConfigs
  );

  //construct lookup table of networks
  const linkedNetworks: { [key: string]: boolean } = Object.values(customNodes).reduce(
    (networkMap, currentNode) => ({ ...networkMap, [currentNode.network]: true }),
    {}
  );

  for (const customNetwork of Object.values(customNetworks)) {
    if (!linkedNetworks[customNetwork.id]) {
      yield put(removeCustomNetwork(customNetwork.id));
    }
  }
}

//#endregion Network

//#region Nodes

// @HACK For now we reload the app when doing a language swap to force non-connected
// data to reload. Also the use of timeout to avoid using additional actions for now.
export function* reload(): SagaIterator {
  setTimeout(() => location.reload(), 1150);
}

export function* handleChangeNodeRequestedOneTime(): SagaIterator {
  const action: ChangeNodeRequestedOneTimeAction = yield take(
    'CONFIG_NODES_SELECTED_CHANGE_REQUESTED_ONETIME'
  );
  // allow shepherdProvider async init to complete. TODO - don't export shepherdProvider as promise
  yield call(delay, 100);
  yield put(changeNodeRequested(action.payload));
}

export function* handleChangeNodeRequested({
  payload: nodeIdToSwitchTo
}: ChangeNodeRequestedAction): SagaIterator {
  const isStaticNode: boolean = yield select(isStaticNodeId, nodeIdToSwitchTo);
  const currentConfig: NodeConfig = yield select(getNodeConfig);

  // Bail out if they're switching to the same node
  if (currentConfig.id === nodeIdToSwitchTo) {
    yield put(
      changeNodeSucceeded({
        nodeId: currentConfig.id,
        networkId: currentConfig.network
      })
    );
    return;
  }

  function* bailOut(message: string) {
    yield put(showNotification('danger', message, 5000));
    yield put(changeNodeFailed());
  }

  let nextNodeConfig: CustomNodeConfig | StaticNodeConfig;

  if (!isStaticNode) {
    const config: CustomNodeConfig | undefined = yield select(
      getCustomNodeFromId,
      nodeIdToSwitchTo
    );

    if (config) {
      nextNodeConfig = config;
    } else {
      return yield* bailOut(`Attempted to switch to unknown node '${nodeIdToSwitchTo}'`);
    }
  } else {
    nextNodeConfig = yield select(getStaticNodeFromId, nodeIdToSwitchTo);
  }

  const nextNetwork: StaticNetworkConfig | CustomNetworkConfig = yield select(
    getNetworkConfigById,
    stripWeb3Network(nextNodeConfig.network)
  );

  if (!nextNetwork) {
    return yield* bailOut(
      `Unknown custom network for your node '${nodeIdToSwitchTo}', try re-adding it`
    );
  }

  const isOffline = yield select(getOffline);
  if (isAutoNode(nodeIdToSwitchTo)) {
    shepherd.auto();
    if (getShepherdNetwork() !== nextNodeConfig.network) {
      yield apply(shepherd, shepherd.switchNetworks, [nextNodeConfig.network]);
    }
  } else {
    try {
      yield apply(shepherd, shepherd.manual, [nodeIdToSwitchTo, isOffline]);
    } catch (err) {
      console.error(err);
      return yield* bailOut(translateRaw('ERROR_32'));
    }
  }

  let currentBlock = '???';
  try {
    currentBlock = yield apply(shepherdProvider, shepherdProvider.getCurrentBlock);
  } catch (err) {
    if (!isOffline) {
      console.error(err);
      return yield* bailOut(translateRaw('ERROR_32'));
    }
  }

  yield put(setLatestBlock(currentBlock));
  yield put(changeNodeSucceeded({ networkId: nextNodeConfig.network, nodeId: nodeIdToSwitchTo }));

  if (currentConfig.network !== nextNodeConfig.network) {
    yield fork(handleNewNetwork);
  }
}

export function* handleAddCustomNode(action: AddCustomNodeAction): SagaIterator {
  const config = action.payload;
  shepherd.useProvider(
    'myccustom',
    config.id,
    makeProviderConfig({ network: config.network }),
    config
  );
  yield put(changeNodeRequested(config.id));
}

export function* handleNewNetwork() {
  yield put(resetWallet());
}

export function* handleNodeChangeForce({ payload: staticNodeIdToSwitchTo }: ChangeNodeForceAction) {
  // does not perform node online check before changing nodes
  // necessary when switching back from Web3 provider so node
  // dropdown does not get stuck if node is offline

  const isStaticNode: boolean = yield select(isStaticNodeId, staticNodeIdToSwitchTo);

  if (!isStaticNode) {
    return;
  }

  const nodeConfig = yield select(getStaticNodeFromId, staticNodeIdToSwitchTo);

  // force the node change
  yield put(changeNodeSucceeded({ networkId: nodeConfig.network, nodeId: staticNodeIdToSwitchTo }));

  // also put the change through as usual so status check and
  // error messages occur if the node is unavailable
  yield put(changeNodeRequested(staticNodeIdToSwitchTo));
}

export function* handleChangeNetworkRequested({ payload: network }: ChangeNetworkRequestedAction) {
  let desiredNode = '';
  const autoNodeName = makeAutoNodeName(network);
  const isStaticNode: boolean = yield select(isStaticNodeId, autoNodeName);

  if (isStaticNode) {
    desiredNode = autoNodeName;
  } else {
    const allNodes: { [id: string]: NodeConfig } = yield select(getAllNodes);
    const networkNode = Object.values(allNodes).find(n => n.network === network);
    if (networkNode) {
      desiredNode = networkNode.id;
    }
  }

  if (desiredNode) {
    yield put(changeNodeRequested(desiredNode));
  } else {
    yield put(
      showNotification(
        'danger',
        translateRaw('NETWORK_UNKNOWN_ERROR', {
          $network: network
        }),
        5000
      )
    );
  }
}

export function* handleRemoveCustomNode({ payload: nodeId }: RemoveCustomNodeAction): SagaIterator {
  // If custom node is currently selected, go back to default node
  const currentNodeId = yield select(getNodeId);
  if (nodeId === currentNodeId) {
    yield put(changeNodeForce(SELECTED_NODE_INITIAL_STATE.nodeId));
  }
}
//#endregion Nodes

//#region Web3

let web3Added = false;

export function* initWeb3Node(): SagaIterator {
  const { chainId, lib } = yield call(setupWeb3Node);
  const network: ReturnType<typeof getNetworkByChainId> = yield select(
    getNetworkByChainId,
    chainId
  );

  if (!network) {
    throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
  }

  const web3Network = makeWeb3Network(network.id);
  const id = 'web3';

  const config: StaticNodeConfig = {
    id,
    isCustom: false,
    network: web3Network as any,
    service: Web3Service,
    hidden: true
  };

  if (getShepherdManualMode()) {
    yield apply(shepherd, shepherd.auto);
  }

  if (!web3Added) {
    shepherd.useProvider('web3', id, makeProviderConfig({ network: web3Network }));
  }

  web3Added = true;

  yield put(web3SetNode({ id, config }));
  return lib;
}

// inspired by v3:
// https://github.com/kvhnuke/etherwallet/blob/417115b0ab4dd2033d9108a1a5c00652d38db68d/app/scripts/controllers/decryptWalletCtrl.js#L311
export function* unlockWeb3(): SagaIterator {
  try {
    const nodeLib = yield call(initWeb3Node);

    yield put(changeNodeRequested('web3'));
    yield take(
      (action: any) =>
        action.type === CONFIG_NODES_SELECTED.CHANGE_SUCCEEDED && action.payload.nodeId === 'web3'
    );

    const web3Node: any | null = yield select(getWeb3Node);

    if (!web3Node) {
      throw Error('Web3 node config not found!');
    }

    const network = web3Node.network;

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Cannot use Web3 wallet without a Web3 node.');
    }

    const accounts: string = yield apply(nodeLib, nodeLib.getAccounts);
    const address = accounts[0];

    if (!address) {
      throw new Error('No accounts found in MetaMask / Mist.');
    }
    const wallet = new Web3Wallet(address, stripWeb3Network(network));
    yield put(setWallet(wallet));
  } catch (err) {
    console.error(err);
    // unset web3 node so node dropdown isn't disabled
    yield put(web3UnsetNode());
    yield put(showNotification('danger', translateRaw(err.message)));
  }
}

// unset web3 as the selected node if a non-web3 wallet has been selected
export function* unsetWeb3NodeOnWalletEvent(action: walletTypes.SetWalletAction): SagaIterator {
  const node = yield select(getNodeId);
  const newWallet = action.payload;
  const isWeb3Wallet = newWallet instanceof Web3Wallet;

  if (node !== 'web3' || isWeb3Wallet) {
    return;
  }

  const prevNodeId: string = yield select(getPreviouslySelectedNode);

  // forcefully switch back to a node with the same network as MetaMask/Mist
  yield put(changeNodeForce(prevNodeId));
}

export function* unsetWeb3Node(): SagaIterator {
  const node = yield select(getNodeId);

  if (node !== 'web3') {
    return;
  }

  const prevNodeId: string = yield select(getPreviouslySelectedNode);

  // forcefully switch back to a node with the same network as MetaMask/Mist
  yield put(changeNodeForce(prevNodeId));
}
//#endregion Web3

export function* configSaga(): SagaIterator {
  const networkSaga = [takeEvery(CONFIG_NETWORKS_CUSTOM.REMOVE, pruneCustomNetworks)];
  const nodeSaga = [
    fork(handleChangeNodeRequestedOneTime),
    takeEvery(CONFIG_NODES_SELECTED.CHANGE_REQUESTED, handleChangeNodeRequested),
    takeEvery(CONFIG_NODES_SELECTED.CHANGE_FORCE, handleNodeChangeForce),
    takeEvery(CONFIG_NETWORKS.CHANGE_NETWORK_REQUESTED, handleChangeNetworkRequested),
    takeEvery(CONFIG_META.LANGUAGE_CHANGE, reload),
    takeEvery(CONFIG_NODES_CUSTOM.ADD, handleAddCustomNode),
    takeEvery(CONFIG_NODES_CUSTOM.REMOVE, handleRemoveCustomNode)
  ];
  const web3 = [
    takeEvery(CONFIG_NODES_STATIC.WEB3_UNSET, unsetWeb3Node),
    takeEvery(walletTypes.WalletActions.SET, unsetWeb3NodeOnWalletEvent),
    takeEvery(walletTypes.WalletActions.UNLOCK_WEB3, unlockWeb3)
  ];

  yield all([...networkSaga, ...nodeSaga, ...web3]);
}
