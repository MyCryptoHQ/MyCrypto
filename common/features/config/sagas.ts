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
import { notificationsActions } from 'features/notifications';
import { walletTypes, walletActions } from 'features/wallet';
import * as configMetaTypes from './meta/types';
import * as configMetaActions from './meta/actions';
import * as configMetaSelectors from './meta/selectors';
import * as configNetworksTypes from './networks/types';
import * as configNetworksSelectors from './networks/selectors';
import * as configNetworksCustomTypes from './networks/custom/types';
import * as configNetworksCustomActions from './networks/custom/actions';
import * as configNetworksCustomSelectors from './networks/custom/selectors';
import * as configNodesSelectors from './nodes/selectors';
import * as configNodesCustomTypes from './nodes/custom/types';
import * as configNodesCustomSelectors from './nodes/custom/selectors';
import * as configNodesSelectedTypes from './nodes/selected/types';
import * as configNodesSelectedActions from './nodes/selected/actions';
import * as configNodesSelectedReducer from './nodes/selected/reducer';
import * as configNodesSelectedSelectors from './nodes/selected/selectors';
import * as configNodesStaticTypes from './nodes/static/types';
import * as configNodesStaticActions from './nodes/static/actions';
import * as configNodesStaticSelectors from './nodes/static/selectors';
import * as selectors from './selectors';

//#region Network
// If there are any orphaned custom networks, prune them
export function* pruneCustomNetworks(): SagaIterator {
  const customNodes: AppState['config']['nodes']['customNodes'] = yield select(
    configNodesCustomSelectors.getCustomNodeConfigs
  );
  const customNetworks: AppState['config']['networks']['customNetworks'] = yield select(
    configNetworksCustomSelectors.getCustomNetworkConfigs
  );

  //construct lookup table of networks
  const linkedNetworks: { [key: string]: boolean } = Object.values(customNodes).reduce(
    (networkMap, currentNode) => ({ ...networkMap, [currentNode.network]: true }),
    {}
  );

  for (const customNetwork of Object.values(customNetworks)) {
    if (!linkedNetworks[customNetwork.id]) {
      yield put(configNetworksCustomActions.removeCustomNetwork(customNetwork.id));
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
  const action: configNodesSelectedTypes.ChangeNodeRequestedOneTimeAction = yield take(
    'CONFIG_NODES_SELECTED_CHANGE_REQUESTED_ONETIME'
  );
  // allow shepherdProvider async init to complete. TODO - don't export shepherdProvider as promise
  yield call(delay, 100);
  yield put(configNodesSelectedActions.changeNodeRequested(action.payload));
}

export function* handleChangeNodeRequested({
  payload: nodeIdToSwitchTo
}: configNodesSelectedTypes.ChangeNodeRequestedAction): SagaIterator {
  const isStaticNode: boolean = yield select(
    configNodesStaticSelectors.isStaticNodeId,
    nodeIdToSwitchTo
  );
  const currentConfig: NodeConfig = yield select(configNodesSelectors.getNodeConfig);

  // Bail out if they're switching to the same node
  if (currentConfig.id === nodeIdToSwitchTo) {
    yield put(
      configNodesSelectedActions.changeNodeSucceeded({
        nodeId: currentConfig.id,
        networkId: currentConfig.network
      })
    );
    return;
  }

  function* bailOut(message: string) {
    yield put(notificationsActions.showNotification('danger', message, 5000));
    yield put(configNodesSelectedActions.changeNodeFailed());
  }

  let nextNodeConfig: CustomNodeConfig | StaticNodeConfig;

  if (!isStaticNode) {
    const config: CustomNodeConfig | undefined = yield select(
      configNodesCustomSelectors.getCustomNodeFromId,
      nodeIdToSwitchTo
    );

    if (config) {
      nextNodeConfig = config;
    } else {
      return yield* bailOut(`Attempted to switch to unknown node '${nodeIdToSwitchTo}'`);
    }
  } else {
    nextNodeConfig = yield select(selectors.getStaticNodeFromId, nodeIdToSwitchTo);
  }

  const nextNetwork: StaticNetworkConfig | CustomNetworkConfig = yield select(
    configNetworksSelectors.getNetworkConfigById,
    stripWeb3Network(nextNodeConfig.network)
  );

  if (!nextNetwork) {
    return yield* bailOut(
      `Unknown custom network for your node '${nodeIdToSwitchTo}', try re-adding it`
    );
  }

  const isOffline = yield select(configMetaSelectors.getOffline);
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

  yield put(configMetaActions.setLatestBlock(currentBlock));
  yield put(
    configNodesSelectedActions.changeNodeSucceeded({
      networkId: nextNodeConfig.network,
      nodeId: nodeIdToSwitchTo
    })
  );

  if (currentConfig.network !== nextNodeConfig.network) {
    yield fork(handleNewNetwork);
  }
}

export function* handleAddCustomNode(
  action: configNodesCustomTypes.AddCustomNodeAction
): SagaIterator {
  const config = action.payload;
  shepherd.useProvider(
    'myccustom',
    config.id,
    makeProviderConfig({ network: config.network }),
    config
  );
  yield put(configNodesSelectedActions.changeNodeRequested(config.id));
}

export function* handleNewNetwork() {
  yield put(walletActions.resetWallet());
}

export function* handleNodeChangeForce({
  payload: staticNodeIdToSwitchTo
}: configNodesSelectedTypes.ChangeNodeForceAction) {
  // does not perform node online check before changing nodes
  // necessary when switching back from Web3 provider so node
  // dropdown does not get stuck if node is offline

  const isStaticNode: boolean = yield select(
    configNodesStaticSelectors.isStaticNodeId,
    staticNodeIdToSwitchTo
  );

  if (!isStaticNode) {
    return;
  }

  const nodeConfig = yield select(selectors.getStaticNodeFromId, staticNodeIdToSwitchTo);

  // force the node change
  yield put(
    configNodesSelectedActions.changeNodeSucceeded({
      networkId: nodeConfig.network,
      nodeId: staticNodeIdToSwitchTo
    })
  );

  // also put the change through as usual so status check and
  // error messages occur if the node is unavailable
  yield put(configNodesSelectedActions.changeNodeRequested(staticNodeIdToSwitchTo));
}

export function* handleChangeNetworkRequested({
  payload: network
}: configNetworksTypes.ChangeNetworkRequestedAction) {
  let desiredNode = '';
  const autoNodeName = makeAutoNodeName(network);
  const isStaticNode: boolean = yield select(
    configNodesStaticSelectors.isStaticNodeId,
    autoNodeName
  );

  if (isStaticNode) {
    desiredNode = autoNodeName;
  } else {
    const allNodes: { [id: string]: NodeConfig } = yield select(selectors.getAllNodes);
    const networkNode = Object.values(allNodes).find(n => n.network === network);
    if (networkNode) {
      desiredNode = networkNode.id;
    }
  }

  if (desiredNode) {
    yield put(configNodesSelectedActions.changeNodeRequested(desiredNode));
  } else {
    yield put(
      notificationsActions.showNotification(
        'danger',
        translateRaw('NETWORK_UNKNOWN_ERROR', {
          $network: network
        }),
        5000
      )
    );
  }
}

export function* handleRemoveCustomNode({
  payload: nodeId
}: configNodesCustomTypes.RemoveCustomNodeAction): SagaIterator {
  // If custom node is currently selected, go back to default node
  const currentNodeId = yield select(configNodesSelectedSelectors.getNodeId);
  if (nodeId === currentNodeId) {
    yield put(
      configNodesSelectedActions.changeNodeForce(
        configNodesSelectedReducer.SELECTED_NODE_INITIAL_STATE.nodeId
      )
    );
  }
}
//#endregion Nodes

//#region Web3

let web3Added = false;

export function* initWeb3Node(): SagaIterator {
  const { chainId, lib } = yield call(setupWeb3Node);
  const network: ReturnType<typeof configNetworksSelectors.getNetworkByChainId> = yield select(
    configNetworksSelectors.getNetworkByChainId,
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

  yield put(configNodesStaticActions.web3SetNode({ id, config }));
  return lib;
}

// inspired by v3:
// https://github.com/kvhnuke/etherwallet/blob/417115b0ab4dd2033d9108a1a5c00652d38db68d/app/scripts/controllers/decryptWalletCtrl.js#L311
export function* unlockWeb3(): SagaIterator {
  try {
    const nodeLib = yield call(initWeb3Node);

    yield put(configNodesSelectedActions.changeNodeRequested('web3'));
    yield take(
      (action: any) =>
        action.type === configNodesSelectedTypes.ConfigNodesSelectedActions.CHANGE_SUCCEEDED &&
        action.payload.nodeId === 'web3'
    );

    const web3Node: any | null = yield select(configNodesSelectors.getWeb3Node);

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
    yield put(walletActions.setWallet(wallet));
  } catch (err) {
    console.error(err);
    // unset web3 node so node dropdown isn't disabled
    yield put(configNodesStaticActions.web3UnsetNode());
    yield put(notificationsActions.showNotification('danger', translateRaw(err.message)));
  }
}

// unset web3 as the selected node if a non-web3 wallet has been selected
export function* unsetWeb3NodeOnWalletEvent(action: walletTypes.SetWalletAction): SagaIterator {
  const node = yield select(configNodesSelectedSelectors.getNodeId);
  const newWallet = action.payload;
  const isWeb3Wallet = newWallet instanceof Web3Wallet;

  if (node !== 'web3' || isWeb3Wallet) {
    return;
  }

  const prevNodeId: string = yield select(configNodesSelectedSelectors.getPreviouslySelectedNode);

  // forcefully switch back to a node with the same network as MetaMask/Mist
  yield put(configNodesSelectedActions.changeNodeForce(prevNodeId));
}

export function* unsetWeb3Node(): SagaIterator {
  const node = yield select(configNodesSelectedSelectors.getNodeId);

  if (node !== 'web3') {
    return;
  }

  const prevNodeId: string = yield select(configNodesSelectedSelectors.getPreviouslySelectedNode);

  // forcefully switch back to a node with the same network as MetaMask/Mist
  yield put(configNodesSelectedActions.changeNodeForce(prevNodeId));
}
//#endregion Web3

export function* configSaga(): SagaIterator {
  const networkSaga = [
    takeEvery(configNetworksCustomTypes.ConfigNetworksCustomActions.REMOVE, pruneCustomNetworks)
  ];
  const nodeSaga = [
    fork(handleChangeNodeRequestedOneTime),
    takeEvery(
      configNodesSelectedTypes.ConfigNodesSelectedActions.CHANGE_REQUESTED,
      handleChangeNodeRequested
    ),
    takeEvery(
      configNodesSelectedTypes.ConfigNodesSelectedActions.CHANGE_FORCE,
      handleNodeChangeForce
    ),
    takeEvery(
      configNetworksTypes.ConfigNetworksActions.CHANGE_NETWORK_REQUESTED,
      handleChangeNetworkRequested
    ),
    takeEvery(configMetaTypes.ConfigMetaActions.LANGUAGE_CHANGE, reload),
    takeEvery(configNodesCustomTypes.ConfigNodesCustomActions.ADD, handleAddCustomNode),
    takeEvery(configNodesCustomTypes.ConfigNodesCustomActions.REMOVE, handleRemoveCustomNode)
  ];
  const web3 = [
    takeEvery(configNodesStaticTypes.ConfigStaticNodesActions.WEB3_UNSET, unsetWeb3Node),
    takeEvery(walletTypes.WalletActions.SET, unsetWeb3NodeOnWalletEvent),
    takeEvery(walletTypes.WalletActions.UNLOCK_WEB3, unlockWeb3)
  ];

  yield all([...networkSaga, ...nodeSaga, ...web3]);
}
