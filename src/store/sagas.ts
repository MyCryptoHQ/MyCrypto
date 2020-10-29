import { all } from 'redux-saga/effects';

import { watchIncrement } from '@features/DevTools/slice';

export default function* rootSaga() {
  yield all([watchIncrement()]);
}
