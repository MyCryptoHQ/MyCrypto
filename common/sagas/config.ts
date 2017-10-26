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
import {
  NODES,
  getCustomNodeConfigFromId,
  makeNodeConfigFromCustomConfig,
} from 'config/data';
import { getNodeConfig, getCustomNodeConfigs } from 'selectors/config';
import { AppState } from 'reducers';
import { TypeKeys } from 'actions/config/constants';
import {
  toggleOfflineConfig,
  TToggleOfflineConfig,
  changeNode,
  setLatestBlock,
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
  const nodeConfig = yield select(getNodeConfig);
  const currentNetwork = nodeConfig.network;

  let actionNode = NODES[action.payload];
  if (!actionNode) {
    const customConfigs = yield select(getCustomNodeConfigs);
    const config = getCustomNodeConfigFromId(action.payload, customConfigs);
    if (config) {
      actionNode = makeNodeConfigFromCustomConfig(config);
    }
  }

  if (!actionNode) {
    yield put(showNotification(
      'danger',
      `Attempted to switch to unknown node '${action.payload}'`,
      5000,
    ));
    return;
  }

  // Grab latest block from the node, before switching, to confirm it's online
  // Give it 5 seconds before we call it offline
  const { latestBlock, timeout } = yield race({
    latestBlock: call(actionNode.lib.getCurrentBlock.bind(actionNode.lib)),
    timeout: call(delay, 5000),
  });

  if (timeout) {
    yield put(showNotification('danger', translate('ERROR_32'), 5000));
    return;
  }

  yield put(setLatestBlock(latestBlock));
  yield put(changeNode(action.payload, actionNode));
  if (currentNetwork !== actionNode.network) {
    yield call(reload);
  }
}

export default function* configSaga(): SagaIterator {
  yield takeLatest(
    TypeKeys.CONFIG_POLL_OFFLINE_STATUS,
    handlePollOfflineStatus
  );
  yield takeEvery(TypeKeys.CONFIG_NODE_CHANGE_INTENT, handleNodeChangeIntent);
  yield takeEvery(TypeKeys.CONFIG_LANGUAGE_CHANGE, reload);
}
