import { delay, SagaIterator } from 'redux-saga';
import {
  call,
  cancel,
  fork,
  put,
  take,
  takeLatest,
  takeEvery,
  select
} from 'redux-saga/effects';
import { NODES } from 'config/data';
import { getNodeConfig } from 'selectors/config';
import { AppState } from 'reducers';
import { TypeKeys } from 'actions/config/constants';
import {
  toggleOfflineConfig,
  TToggleOfflineConfig,
  changeNode
} from 'actions/config';
import { State as ConfigState } from 'reducers/config';

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
  const actionNetwork = NODES[action.payload].network;
  yield put(changeNode(action.payload));
  if (currentNetwork !== actionNetwork) {
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
