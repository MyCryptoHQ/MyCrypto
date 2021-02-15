import { expectSaga } from 'test-utils';

import {
  IPollingPayload,
  poll,
  default as pollingSagaWatcher,
  pollStart,
  pollStop
} from './polling.saga';

const data = 'test';

const pollingParams: IPollingPayload = {
  params: {
    interval: 6000
  },
  successAction: 'pollTest/sucess',
  promise: jest.fn(() => Promise.resolve({ data })),
  transformer: jest.fn((data) => data)
};

describe('PollingSaga', () => {
  it('pollingSaga(): calls pollingSagaWatcher on pollStart dispatch', () => {
    const saga = expectSaga(pollingSagaWatcher);

    return saga
      .dispatch(pollStart(pollingParams))
      .run()
      .then(({ effects }) => {
        console.log(effects.call[0].payload);
        expect(effects.call).toHaveBeenCalledWith(pollingParams.promise);
        expect(effects.put).toHaveBeenCalledWith(pollingParams.successAction, data);
        // expect(effects.call).toHaveBeenCalledWith(delay, pollingParams.params.interval);
      })
      .finally(() => saga.dispatch(pollStop()));
  });
});
