import { SagaIterator } from 'redux-saga';
import { takeEvery } from 'redux-saga/effects';

// @HACK For now we reload the app when doing a language swap to force non-connected
// data to reload. Also the use of timeout to avoid using additional actions for now.
function* reload(): SagaIterator {
  setTimeout(() => location.reload(), 250);
}

export default function* handleConfigChanges(): SagaIterator {
  yield takeEvery('CONFIG_NODE_CHANGE', reload);
  yield takeEvery('CONFIG_LANGUAGE_CHANGE', reload);
}
