import { all, call } from 'redux-saga/effects';

function* helloSaga() {
  yield call(console.log, 'Hello Sagas!');
}

export default function* rootSaga() {
  yield all([helloSaga()]);
}
