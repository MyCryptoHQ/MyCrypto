import { delay, SagaIterator } from 'redux-saga';
import {
  call,
  cancel,
  fork,
  put,
  take,
  takeEvery,
  select,
  apply,
  takeLatest
} from 'redux-saga/effects';
import {
  getNodeId,
  getNodeConfig,
  getOffline,
  isStaticNodeId,
  getCustomNodeFromId,
  getStaticNodeFromId,
  getNetworkConfigById,
  getAllNodes
} from 'selectors/config';
import { TypeKeys } from 'actions/config/constants';
import {
  setOnline,
  setOffline,
  changeNodeRequested,
  changeNodeSucceeded,
  changeNodeFailed,
  changeNodeForce,
  setLatestBlock,
  AddCustomNodeAction,
  ChangeNodeForceAction,
  ChangeNodeRequestedAction,
  ChangeNodeRequestedOneTimeAction,
  ChangeNetworkRequestedAction,
  RemoveCustomNodeAction
} from 'actions/config';
import { showNotification } from 'actions/notifications';
import { resetWallet } from 'actions/wallet';
import { translateRaw } from 'translations';
import { StaticNodeConfig, CustomNodeConfig, NodeConfig } from 'types/node';
import { CustomNetworkConfig, StaticNetworkConfig } from 'types/network';
import {
  getShepherdOffline,
  isAutoNode,
  shepherd,
  shepherdProvider,
  stripWeb3Network,
  makeProviderConfig,
  getShepherdNetwork,
  getShepherdPending,
  makeAutoNodeName
} from 'libs/nodes';
import { INITIAL_STATE as selectedNodeInitialState } from 'reducers/config/nodes/selectedNode';

export function* pollOfflineStatus(): SagaIterator {
  let hasCheckedOnline = false;

  const restoreNotif = showNotification(
    'success',
    'Your connection to the network has been restored!',
    3000
  );
  const lostNetworkNotif = showNotification(
    'danger',
    `You’ve lost your connection to the network, check your internet
      connection or try changing networks from the dropdown at the
      top right of the page.`,
    Infinity
  );
  const offlineNotif = showNotification(
    'info',
    'You are currently offline. Some features will be unavailable.',
    5000
  );

  while (true) {
    yield call(delay, 2500);

    const pending: ReturnType<typeof getShepherdPending> = yield call(getShepherdPending);
    if (pending) {
      continue;
    }

    const isOffline: boolean = yield select(getOffline);
    const balancerOffline = yield call(getShepherdOffline);

    if (!balancerOffline && isOffline) {
      // If we were able to ping but redux says we're offline, mark online
      yield put(restoreNotif);
      yield put(setOnline());
    } else if (balancerOffline && !isOffline) {
      // If we were unable to ping but redux says we're online, mark offline
      // If they had been online, show an error.
      // If they hadn't been online, just inform them with a warning.
      yield put(setOffline());
      if (hasCheckedOnline) {
        yield put(lostNetworkNotif);
      } else {
        yield put(offlineNotif);
      }
    }
    hasCheckedOnline = true;
  }
}

// Fork our recurring API call, watch for the need to cancel.
export function* handlePollOfflineStatus(): SagaIterator {
  const pollOfflineStatusTask = yield fork(pollOfflineStatus);
  yield take('CONFIG_STOP_POLL_OFFLINE_STATE');
  yield cancel(pollOfflineStatusTask);
}

// @HACK For now we reload the app when doing a language swap to force non-connected
// data to reload. Also the use of timeout to avoid using additional actions for now.
export function* reload(): SagaIterator {
  setTimeout(() => location.reload(), 1150);
}

export function* handleChangeNodeRequestedOneTime(): SagaIterator {
  const action: ChangeNodeRequestedOneTimeAction = yield take(
    TypeKeys.CONFIG_CHANGE_NODE_REQUESTED_ONETIME
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
    yield put(changeNodeForce(selectedNodeInitialState.nodeId));
  }
}

export const node = [
  fork(handleChangeNodeRequestedOneTime),
  takeEvery(TypeKeys.CONFIG_CHANGE_NODE_REQUESTED, handleChangeNodeRequested),
  takeEvery(TypeKeys.CONFIG_CHANGE_NODE_FORCE, handleNodeChangeForce),
  takeEvery(TypeKeys.CONFIG_CHANGE_NETWORK_REQUESTED, handleChangeNetworkRequested),
  takeLatest(TypeKeys.CONFIG_POLL_OFFLINE_STATUS, handlePollOfflineStatus),
  takeEvery(TypeKeys.CONFIG_LANGUAGE_CHANGE, reload),
  takeEvery(TypeKeys.CONFIG_ADD_CUSTOM_NODE, handleAddCustomNode),
  takeEvery(TypeKeys.CONFIG_REMOVE_CUSTOM_NODE, handleRemoveCustomNode)
];
