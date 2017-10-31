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
  makeNodeConfigFromCustomConfig,
} from 'utils/node';
import { getNode, getNodeConfig, getCustomNodeConfigs } from 'selectors/config';
import { AppState } from 'reducers';
import { TypeKeys } from 'actions/config/constants';
import {
  toggleOfflineConfig,
  changeNode,
  changeNodeIntent,
  setLatestBlock,
  AddCustomNodeAction,
} from 'actions/config';
import { State as ConfigState } from 'reducers/config';
import { showNotification } from 'actions/notifications';
import translate from 'translations';

export const getConfig = (state: AppState): ConfigState => state.config;

export function* pollOfflineStatus(): SagaIterator {
  while (true) {
    const offline = !navigator.onLine;
    const config = yield select(getConfig);
    const offlineState = config.offline;
    if (offline !== offlineState) {
      yield put(toggleOfflineConfig());
    }
    yield call(delay, 250);
  }
}

// Fork our recurring API call, watch for the need to cancel.
function* handlePollOfflineStatus(): SagaIterator {
  const pollOfflineStatusTask = yield fork(pollOfflineStatus);
  yield take('CONFIG_STOP_POLL_OFFLINE_STATE');
  yield cancel(pollOfflineStatusTask);
}

// @HACK For now we reload the app when doing a language swap to force non-connected
// data to reload. Also the use of timeout to avoid using additional actions for now.
function* reload(): SagaIterator {
  setTimeout(() => location.reload(), 250);
}

function* handleNodeChangeIntent(action): SagaIterator {
  const currentNode = yield select(getNode);
  const currentConfig = yield select(getNodeConfig);

  let actionConfig = NODES[action.payload];
  if (!actionConfig) {
    const customConfigs = yield select(getCustomNodeConfigs);
    const config = getCustomNodeConfigFromId(action.payload, customConfigs);
    if (config) {
      actionConfig = makeNodeConfigFromCustomConfig(config);
    }
  }

  if (!actionConfig) {
    yield put(showNotification(
      'danger',
      `Attempted to switch to unknown node '${action.payload}'`,
      5000,
    ));
    yield put(changeNode(currentNode, currentConfig));
    return;
  }

  // Grab latest block from the node, before switching, to confirm it's online
  // Give it 5 seconds before we call it offline
  let latestBlock
  let timeout;
  try {
    const { lb, to } = yield race({
      lb: call(
        actionConfig.lib.getCurrentBlock.bind(actionConfig.lib)
      ),
      to: call(delay, 5000),
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
  if (currentConfig.network !== actionConfig.network) {
    yield call(reload);
  }
}

export function* switchToNewNode(action: AddCustomNodeAction): SagaIterator {
  const nodeId = makeCustomNodeId(action.payload);
  yield put(changeNodeIntent(nodeId));
}

export default function* configSaga(): SagaIterator {
  yield takeLatest(
    TypeKeys.CONFIG_POLL_OFFLINE_STATUS,
    handlePollOfflineStatus
  );
  yield takeEvery(TypeKeys.CONFIG_NODE_CHANGE_INTENT, handleNodeChangeIntent);
  yield takeEvery(TypeKeys.CONFIG_LANGUAGE_CHANGE, reload);
  yield takeEvery(TypeKeys.CONFIG_ADD_CUSTOM_NODE, switchToNewNode);
}
