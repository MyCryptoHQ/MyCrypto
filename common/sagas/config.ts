import { SagaIterator } from 'redux-saga';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { changeNode } from 'actions/config';
import { NODES } from 'config/data';

import { getNodeConfig } from 'selectors/config';
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

export default function* handleConfigChanges(): SagaIterator {
  yield takeEvery('CONFIG_NODE_CHANGE_INTENT', handleNodeChangeIntent);
  yield takeEvery('CONFIG_LANGUAGE_CHANGE', reload);
}
