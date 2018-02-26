import { delay, SagaIterator } from 'redux-saga';
import {
  call,
  cancel,
  fork,
  put,
  take,
  takeEvery,
  select,
  race,
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
  toggleOffline,
  changeNode,
  changeNodeIntent,
  setLatestBlock,
  AddCustomNodeAction,
  ChangeNodeIntentAction
} from 'actions/config';
import { showNotification } from 'actions/notifications';
import { resetWallet } from 'actions/wallet';
import { translateRaw } from 'translations';
import { StaticNodeConfig, CustomNodeConfig, NodeConfig } from 'types/node';
import { CustomNetworkConfig, StaticNetworkConfig } from 'types/network';

let hasCheckedOnline = false;
export function* pollOfflineStatus(): SagaIterator {
  while (true) {
    const nodeConfig: StaticNodeConfig = yield select(getNodeConfig);
    const isOffline: boolean = yield select(getOffline);

    // If our offline state disagrees with the browser, run a check
    // Don't check if the user is in another tab or window
    const shouldPing = !hasCheckedOnline || navigator.onLine === isOffline;
    if (shouldPing && !document.hidden) {
      const { pingSucceeded } = yield race({
        pingSucceeded: call(nodeConfig.lib.ping.bind(nodeConfig.lib)),
        timeout: call(delay, 5000)
      });

      if (pingSucceeded && isOffline) {
        // If we were able to ping but redux says we're offline, mark online
        yield put(
          showNotification('success', 'Your connection to the network has been restored!', 3000)
        );
        yield put(toggleOffline());
      } else if (!pingSucceeded && !isOffline) {
        // If we were unable to ping but redux says we're online, mark offline
        // If they had been online, show an error.
        // If they hadn't been online, just inform them with a warning.
        if (hasCheckedOnline) {
          yield put(
            showNotification(
              'danger',
              `You’ve lost your connection to the network, check your internet
              connection or try changing networks from the dropdown at the
              top right of the page.`,
              Infinity
            )
          );
        } else {
          yield put(
            showNotification(
              'info',
              'You are currently offline. Some features will be unavailable.',
              5000
            )
          );
        }
        yield put(toggleOffline());
      } else {
        // If neither case was true, try again in 5s
        yield call(delay, 5000);
      }
      hasCheckedOnline = true;
    } else {
      yield call(delay, 1000);
    }
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

  // Grab current block from the node, before switching, to confirm it's online
  // Give it 5 seconds before we call it offline
  let currentBlock;
  let timeout;
  try {
    const { lb, to } = yield race({
      lb: apply(nextNodeConfig.lib, nextNodeConfig.lib.getCurrentBlock),
      to: call(delay, 5000)
    });
    currentBlock = lb;
    timeout = to;
  } catch (err) {
    console.error(err);
    // Whether it times out or errors, same message
    timeout = true;
  }

  if (timeout) {
    return yield* bailOut(translateRaw('ERROR_32'));
  }

  const nextNetwork: StaticNetworkConfig | CustomNetworkConfig = yield select(
    getNetworkConfigById,
    nextNodeConfig.network
  );

  if (!nextNetwork) {
    return yield* bailOut(
      `Unknown custom network for your node '${nodeIdToSwitchTo}', try re-adding it`
    );
  }

  yield put(setLatestBlock(currentBlock));
  yield put(changeNode({ networkId: nextNodeConfig.network, nodeId: nodeIdToSwitchTo }));

  if (currentConfig.network !== nextNodeConfig.network) {
    yield fork(handleNewNetwork);
  }
}

export function* switchToNewNode(action: AddCustomNodeAction): SagaIterator {
  yield put(changeNodeIntent(action.payload.id));
}

export function* handleNewNetwork() {
  yield put(resetWallet());
}

export const node = [
  takeEvery(TypeKeys.CONFIG_NODE_CHANGE_INTENT, handleNodeChangeIntent),
  takeLatest(TypeKeys.CONFIG_POLL_OFFLINE_STATUS, handlePollOfflineStatus),
  takeEvery(TypeKeys.CONFIG_LANGUAGE_CHANGE, reload),
  takeEvery(TypeKeys.CONFIG_ADD_CUSTOM_NODE, switchToNewNode)
];
