import { createAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga-test-plan/matchers';
import { expectSaga, testSaga } from 'test-utils';

import { IPollingPayload, default as pollingSagaWatcher, pollingWorker } from './polling.saga';

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

  it('pollingWorker(): stops on error', () => {
    const err = new Error('error');
    testSaga(pollingWorker, pollingParams)
      .next()
      .throw(err)
      .put(pollStop())
      .next()
      .finish()
      .isDone();
  });

  it('pollingWorker(): retries after a certain time on error', () => {
    const retryAfterParams: IPollingPayload = {
      startAction: pollStart,
      stopAction: pollStop,
      params: {
        interval: 1000,
        retryOnFailure: true,
        retries: 2,
        retryAfter: 100
      },
      saga: falseSaga
    };

    const err = new Error('error');
    testSaga(pollingWorker, retryAfterParams)
      .next()
      .throw(err)
      .delay(100)
      .next()
      .throw(err)
      .delay(100)
      .next()
      .throw(err)
      .put(pollStop())
      .next()
      .finish()
      .isDone();
  });

  it('pollingWorker(): retries instantly on error', () => {
    const instantRetryParams: IPollingPayload = {
      startAction: pollStart,
      stopAction: pollStop,
      params: {
        interval: 1000,
        retryOnFailure: true,
        retries: 2
      },
      saga: falseSaga
    };

    const err = new Error('error');
    testSaga(pollingWorker, instantRetryParams)
      .next()
      .throw(err)
      .throw(err)
      .throw(err)
      .put(pollStop())
      .next()
      .finish()
      .isDone();
  });
});
