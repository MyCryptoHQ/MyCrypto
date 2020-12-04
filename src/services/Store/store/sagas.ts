import { all } from 'redux-saga/effects';

import { watchIncrement } from '@features/DevTools/slice';

import { fetchMembershipsSaga } from './membership.slice';
import { networkSaga } from './network.slice';

export default function* rootSaga() {
  yield all([watchIncrement(), fetchMembershipsSaga(), networkSaga()]);
}
