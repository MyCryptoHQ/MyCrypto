import { createAction } from '@reduxjs/toolkit';
import { expectSaga } from 'test-utils';

import {
  IPollingPayload,
  default as pollingSagaWatcher,
  pollStart,
  pollStop
} from './polling.saga';

const data = 'test';

const successAction = createAction<string>(`test/test`);

const pollingParams: IPollingPayload = {
  params: {
    interval: 10000
  },
  successAction: successAction,
  promise: jest.fn(() => Promise.resolve(data)),
  transformer: jest.fn((data) => data)
};

describe('PollingSaga', () => {
  it('pollingSaga(): calls pollingSagaWatcher on pollStart dispatch', () => {
    return expectSaga(pollingSagaWatcher, pollStart(pollingParams))
      .call(pollingParams.promise)
      .put(pollingParams.successAction(data))
      .silentRun();
  });

  it('pollingSaga(): stops polling on pollStop dispatch', () => {
    return expectSaga(pollingSagaWatcher, pollStart(pollingParams))
      .call(pollingParams.promise)
      .put(pollingParams.successAction(data))
      .dispatch(pollStop())
      .silentRun()
      .then(({ effects }) => {
        // effects.call = total of call effects + expect-saga assertions - call assertions
        expect(effects.call).toHaveLength(3);

        // Put is undefined because of the previous put assetion
        expect(effects.put).toBeUndefined();
      });
  });
});
