import { delay, SagaIterator } from 'redux-saga';
import {
  call,
  cancel,
  fork,
  put,
  take,
  takeLatest,
  takeEvery,
  select,
  race
} from 'redux-saga/effects';
import { NODES } from 'config/data';
import {
  makeCustomNodeId,
  getCustomNodeConfigFromId,
  makeNodeConfigFromCustomConfig
} from 'utils/node';
import {
  getNode,
  getNodeConfig,
  getCustomNodeConfigs,
  getOffline,
  getForceOffline
} from 'selectors/config';
import { AppState } from 'reducers';
import { TypeKeys } from 'actions/config/constants';
import {
  toggleOfflineConfig,
  changeNode,
  changeNodeIntent,
  setLatestBlock,
  AddCustomNodeAction,
  ChangeNodeIntentAction
} from 'actions/config';
import { showNotification } from 'actions/notifications';
import translate from 'translations';
import { Web3Wallet } from 'libs/wallet';
import { getWalletInst } from 'selectors/wallet';
import { TypeKeys as WalletTypeKeys } from 'actions/wallet/constants';
import {
  State as ConfigState,
  INITIAL_STATE as configInitialState
} from 'reducers/config';

export const getConfig = (state: AppState): ConfigState => state.config;

let hasCheckedOnline = false;
export function* pollOfflineStatus(): SagaIterator {
  while (true) {
    const node = yield select(getNodeConfig);
    const isOffline = yield select(getOffline);
    const isForcedOffline = yield select(getForceOffline);

    // If they're forcing themselves offline, exit the loop. It will be
    // kicked off again if they toggle it in handleTogglePollOfflineStatus.
    if (isForcedOffline) {
      return;
    }

    // If our offline state disagrees with the browser, run a check
    // Don't check if the user is in another tab or window
    const shouldPing = !hasCheckedOnline || navigator.onLine === isOffline;
    if (shouldPing && !document.hidden) {
      hasCheckedOnline = true;
      const { pingSucceeded } = yield race({
        pingSucceeded: call(node.lib.ping.bind(node.lib)),
        timeout: call(delay, 5000)
      });

      if (pingSucceeded && isOffline) {
        // If we were able to ping but redux says we're offline, mark online
        yield put(
          showNotification(
            'success',
            'Your connection to the network has been restored!',
            3000
          )
        );
        yield put(toggleOfflineConfig());
      } else if (!pingSucceeded && !isOffline) {
        // If we were unable to ping but redux says we're online, mark offline
        yield put(
          showNotification(
            'danger',
            `You’ve lost your connection to the network, check your internet
            connection or try changing networks from the dropdown at the
            top right of the page.`,
            Infinity
          )
        );
        yield put(toggleOfflineConfig());
      } else {
        // If neither case was true, try again in 5s
        yield call(delay, 5000);
      }
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

export function* handleTogglePollOfflineStatus(): SagaIterator {
  const isForcedOffline = yield select(getForceOffline);
  if (isForcedOffline) {
    yield fork(handlePollOfflineStatus);
  } else {
    yield call(handlePollOfflineStatus);
  }
}

// @HACK For now we reload the app when doing a language swap to force non-connected
// data to reload. Also the use of timeout to avoid using additional actions for now.
export function* reload(): SagaIterator {
  setTimeout(() => location.reload(), 250);
}

export function* handleNodeChangeIntent(
  action: ChangeNodeIntentAction
): SagaIterator {
  const currentNode = yield select(getNode);
  const currentConfig = yield select(getNodeConfig);
  const currentNetwork = currentConfig.network;

  let actionConfig = NODES[action.payload];
  if (!actionConfig) {
    const customConfigs = yield select(getCustomNodeConfigs);
    const config = getCustomNodeConfigFromId(action.payload, customConfigs);
    if (config) {
      actionConfig = makeNodeConfigFromCustomConfig(config);
    }
  }

  if (!actionConfig) {
    yield put(
      showNotification(
        'danger',
        `Attempted to switch to unknown node '${action.payload}'`,
        5000
      )
    );
    yield put(changeNode(currentNode, currentConfig));
    return;
  }

  // Grab latest block from the node, before switching, to confirm it's online
  // Give it 5 seconds before we call it offline
  let latestBlock;
  let timeout;
  try {
    const { lb, to } = yield race({
      lb: call(actionConfig.lib.getCurrentBlock.bind(actionConfig.lib)),
      to: call(delay, 5000)
    });
    latestBlock = lb;
    timeout = to;
  } catch (err) {
    // Whether it times out or errors, same message
    timeout = true;
  }

  if (timeout) {
    yield put(showNotification('danger', translate('ERROR_32'), 5000));
    yield put(changeNode(currentNode, currentConfig));
    return;
  }

  yield put(setLatestBlock(latestBlock));
  yield put(changeNode(action.payload, actionConfig));

  const currentWallet = yield select(getWalletInst);

  // if there's no wallet, do not reload as there's no component state to resync
  if (currentWallet && currentNetwork !== actionConfig.network) {
    yield call(reload);
  }
}

export function* switchToNewNode(action: AddCustomNodeAction): SagaIterator {
  const nodeId = makeCustomNodeId(action.payload);
  yield put(changeNodeIntent(nodeId));
}

// unset web3 as the selected node if a non-web3 wallet has been selected
export function* unsetWeb3Node(action): SagaIterator {
  const node = yield select(getNode);
  const nodeConfig = yield select(getNodeConfig);
  const newWallet = action.payload;
  const isWeb3Wallet = newWallet instanceof Web3Wallet;

  if (node !== 'web3' || isWeb3Wallet) {
    return;
  }

  // switch back to a node with the same network as MetaMask/Mist
  yield put(changeNodeIntent(equivalentNodeOrDefault(nodeConfig)));
}

export const equivalentNodeOrDefault = nodeConfig => {
  const node = Object.keys(NODES)
    .filter(key => key !== 'web3')
    .reduce((found, key) => {
      const config = NODES[key];
      if (found.length) {
        return found;
      }
      if (nodeConfig.network === config.network) {
        return (found = key);
      }
      return found;
    }, '');

  // if no equivalent node was found, use the app default
  return node.length ? node : configInitialState.nodeSelection;
};

export default function* configSaga(): SagaIterator {
  yield takeLatest(
    TypeKeys.CONFIG_POLL_OFFLINE_STATUS,
    handlePollOfflineStatus
  );
  yield takeEvery(TypeKeys.CONFIG_FORCE_OFFLINE, handleTogglePollOfflineStatus);
  yield takeEvery(TypeKeys.CONFIG_NODE_CHANGE_INTENT, handleNodeChangeIntent);
  yield takeEvery(TypeKeys.CONFIG_LANGUAGE_CHANGE, reload);
  yield takeEvery(TypeKeys.CONFIG_ADD_CUSTOM_NODE, switchToNewNode);
  yield takeEvery(WalletTypeKeys.WALLET_SET, unsetWeb3Node);
  yield takeEvery(WalletTypeKeys.WALLET_RESET, unsetWeb3Node);
}
