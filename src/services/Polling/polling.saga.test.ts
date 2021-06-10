import { createAction } from '@reduxjs/toolkit';
import { call, put } from 'redux-saga/effects';
import { expectSaga } from 'test-utils';

import { IPollingPayload, default as pollingSagaWatcher } from './polling.saga';

const testAction = createAction(`fake/action`);

function* falseSaga() {
  yield put(testAction);
}

const pollStart = createAction('fake/start');
const pollStop = createAction('fake/stop');

const pollingParams: IPollingPayload = {
  startAction: pollStart,
  stopAction: pollStop,
  params: {
    interval: 10000
  },
  saga: falseSaga
};

describe('PollingSaga', () => {
  it('pollingSaga(): calls pollingSagaWatcher on pollStart dispatch', () => {
    return expectSaga(pollingSagaWatcher, pollingParams)
      .call(pollingParams.saga)
      .put(testAction)
      .silentRun();
  });

  it('pollingSaga(): stops polling on pollStop dispatch', () => {
    return expectSaga(pollingSagaWatcher, pollingParams)
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

  it('pollingSaga(): Retries on failure', () => {
    function* failingSaga() {
      yield call(() => new Promise());
    }

    const pollStart = createAction('fake/start');
    const pollStop = createAction('fake/stop');

    const failingPollingParams: IPollingPayload = {
      startAction: pollStart,
      stopAction: pollStop,
      params: {
        interval: 10000,
        retryOnFailure: true,
        retries: 2,
        retryAfter: 200
      },
      saga: failingSaga
    };
    return expectSaga(pollingSagaWatcher, pollingParams)
      .call(failingPollingParams.saga)
      .delay(failingPollingParams.params.retryAfter!)
      .call(failingPollingParams.saga)
      .delay(failingPollingParams.params.retryAfter!)
      .silentRun();
  });
});
