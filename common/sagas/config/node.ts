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
  getNetworkConfigById
} from 'selectors/config';
import { TypeKeys } from 'actions/config/constants';
import {
  setOnline,
  setOffline,
  changeNode,
  changeNodeIntent,
  setLatestBlock,
  AddCustomNodeAction,
  ChangeNodeForceAction,
  ChangeNodeIntentAction,
  ChangeNodeIntentOneTimeAction
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
  getShepherdPending
} from 'libs/nodes';

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

export function* handleNodeChangeIntentOneTime(): SagaIterator {
  const action: ChangeNodeIntentOneTimeAction = yield take(
    TypeKeys.CONFIG_NODE_CHANGE_INTENT_ONETIME
  );
  // allow shepherdProvider async init to complete. TODO - don't export shepherdProvider as promise
  yield call(delay, 100);
  yield put(changeNodeIntent(action.payload));
}

export function* handleNodeChangeIntent({
  payload: nodeIdToSwitchTo
}: ChangeNodeIntentAction): SagaIterator {
  const isStaticNode: boolean = yield select(isStaticNodeId, nodeIdToSwitchTo);
  const currentConfig: NodeConfig = yield select(getNodeConfig);

  function* bailOut(message: string) {
    const currentNodeId: string = yield select(getNodeId);
    yield put(showNotification('danger', message, 5000));
    yield put(changeNode({ networkId: currentConfig.network, nodeId: currentNodeId }));
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

  if (isAutoNode(nodeIdToSwitchTo)) {
    shepherd.auto();
    if (getShepherdNetwork() !== nextNodeConfig.network) {
      yield apply(shepherd, shepherd.switchNetworks, [nextNodeConfig.network]);
    }
  } else {
    try {
      yield apply(shepherd, shepherd.manual, [nodeIdToSwitchTo, false]);
    } catch (err) {
      console.error(err);
      return yield* bailOut(translateRaw('ERROR_32'));
    }
  }

  let currentBlock;
  try {
    currentBlock = yield apply(shepherdProvider, shepherdProvider.getCurrentBlock);
  } catch (err) {
    console.error(err);
    return yield* bailOut(translateRaw('ERROR_32'));
  }

  yield put(setLatestBlock(currentBlock));
  yield put(changeNode({ networkId: nextNodeConfig.network, nodeId: nodeIdToSwitchTo }));

  if (currentConfig.network !== nextNodeConfig.network) {
    yield fork(handleNewNetwork);
  }
}

export function* handleAddCustomNode(action: AddCustomNodeAction): SagaIterator {
  const { payload: { config } } = action;
  shepherd.useProvider(
    'myccustom',
    config.id,
    makeProviderConfig({ network: config.network }),
    config
  );
  yield put(changeNodeIntent(action.payload.id));
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
  yield put(changeNode({ networkId: nodeConfig.network, nodeId: staticNodeIdToSwitchTo }));

  // also put the change through as usual so status check and
  // error messages occur if the node is unavailable
  yield put(changeNodeIntent(staticNodeIdToSwitchTo));
}

export const node = [
  fork(handleNodeChangeIntentOneTime),
  takeEvery(TypeKeys.CONFIG_NODE_CHANGE_INTENT, handleNodeChangeIntent),
  takeEvery(TypeKeys.CONFIG_NODE_CHANGE_FORCE, handleNodeChangeForce),
  takeLatest(TypeKeys.CONFIG_POLL_OFFLINE_STATUS, handlePollOfflineStatus),
  takeEvery(TypeKeys.CONFIG_LANGUAGE_CHANGE, reload),
  takeEvery(TypeKeys.CONFIG_ADD_CUSTOM_NODE, handleAddCustomNode)
];
