import { createAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga/effects';
import { expectSaga } from 'test-utils';

import {
  IPollingPayload,
  default as pollingSagaWatcher,
  pollStart,
  pollStop
} from './polling.saga';

const testAction = createAction(`test/test`);

function* falseSaga() {
  yield put(testAction);
}

const pollingParams: IPollingPayload = {
  params: {
    interval: 10000
  },
  saga: falseSaga
};

describe('PollingSaga', () => {
  it('pollingSaga(): calls pollingSagaWatcher on pollStart dispatch', () => {
    return expectSaga(pollingSagaWatcher, pollStart(pollingParams))
      .call(pollingParams.saga)
      .put(testAction)
      .silentRun();
  });

  it('pollingSaga(): stops polling on pollStop dispatch', () => {
    return expectSaga(pollingSagaWatcher, pollStart(pollingParams))
      .call(pollingParams.saga)
      .put(testAction)
      .dispatch(pollStop())
      .silentRun()
      .then(({ effects }) => {
        // effects.call = total of call effects + expect-saga assertions - call assertions
        expect(effects.call).toHaveLength(4);
        expect(effects.put).toBeUndefined();
      });
  });
});
