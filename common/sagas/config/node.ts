import { delay, SagaIterator } from 'redux-saga';
import { call, fork, put, take, takeEvery, select, apply } from 'redux-saga/effects';
import { bindActionCreators } from 'redux';
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
import { configuredStore as store } from 'store';

window.addEventListener('load', () => {
  const getShepherdStatus = () => ({
    pending: getShepherdPending(),
    isOnline: !getShepherdOffline()
  });

  const { online, offline, lostNetworkNotif, offlineNotif, restoreNotif } = bindActionCreators(
    {
      offline: setOffline,
      online: setOnline,
      restoreNotif: () =>
        showNotification('success', 'Your connection to the network has been restored!', 3000),
      lostNetworkNotif: () =>
        showNotification(
          'danger',
          `You’ve lost your connection to the network, check your internet
connection or try changing networks from the dropdown at the
top right of the page.`,
          Infinity
        ),

      offlineNotif: () =>
        showNotification(
          'info',
          'You are currently offline. Some features will be unavailable.',
          5000
        )
    },
    store.dispatch
  );

  const getAppOnline = () => !getOffline(store.getState());

  /**
   * @description Repeatedly polls itself to check for online state conflict occurs, implemented in recursive style for flexible polling times
   * as network requests take a variable amount of time.
   *
   * Whenever an app online state conflict occurs, it resolves the conflict with the following priority:
   * * If shepherd is online but app is offline ->  do a ping request via shepherd provider, with the result of the ping being the set app state
   * * If shepherd is offline but app is online -> set app to offline as it wont be able to make requests anyway
   */
  async function detectOnlineStateConflict() {
    const shepherdStatus = getShepherdStatus();
    const appOffline = getAppOnline();
    const onlineStateConflict = shepherdStatus.isOnline !== appOffline;

    if (shepherdStatus.pending || !onlineStateConflict) {
      return setTimeout(detectOnlineStateConflict, 1000);
    }

    // if app reports online but shepherd offline, then set app offline
    if (appOffline && !shepherdStatus.isOnline) {
      lostNetworkNotif();
      offline();
    } else if (!appOffline && shepherdStatus.isOnline) {
      // if app reports offline but shepherd reports online
      // send a request to shepherd provider to see if we can still send out requests
      const success = await shepherdProvider.ping().catch(() => false);
      if (success) {
        restoreNotif();
        online();
      }
    }
    detectOnlineStateConflict();
  }
  detectOnlineStateConflict();

  window.addEventListener('offline', () => {
    const previouslyOnline = getAppOnline();

    // if browser reports as offline and we were previously online
    // then set offline without checking balancer state
    if (!navigator.onLine && previouslyOnline) {
      offlineNotif();
      offline();
    }
  });
});

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
    yield put(changeNodeForce(selectedNodeInitialState.nodeId));
  }
}

export const node = [
  fork(handleChangeNodeRequestedOneTime),
  takeEvery(TypeKeys.CONFIG_CHANGE_NODE_REQUESTED, handleChangeNodeRequested),
  takeEvery(TypeKeys.CONFIG_CHANGE_NODE_FORCE, handleNodeChangeForce),
  takeEvery(TypeKeys.CONFIG_CHANGE_NETWORK_REQUESTED, handleChangeNetworkRequested),
  takeEvery(TypeKeys.CONFIG_LANGUAGE_CHANGE, reload),
  takeEvery(TypeKeys.CONFIG_ADD_CUSTOM_NODE, handleAddCustomNode),
  takeEvery(TypeKeys.CONFIG_REMOVE_CUSTOM_NODE, handleRemoveCustomNode)
];
