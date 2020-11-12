import { all } from 'redux-saga/effects';

import { importStateWatcher } from './app.saga';

export default function* rootSaga() {
  yield all([importStateWatcher()]);
}
