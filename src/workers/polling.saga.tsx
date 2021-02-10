import { call, delay, put, race, take } from 'redux-saga/effects';

import { TURL } from '@types';

export enum PollingActions {
  START = 'POLL_START',
  ERROR = 'POLL_ERROR',
  STOP = 'POLL_STOP'
}

interface IPollingPayload {
  url: TURL;
  interval: number;
  successAction: string;
  errorAction: string;
  factory?(result: any): any;
}

function* pollingSaga(payload: IPollingPayload) {
  const { url, interval, successAction, errorAction, factory } = payload;

  // @todo: Find a best place for this function
  const getRequest = async (url: TURL) => {
    try {
      return await fetch(url).then((res) => res.json());
    } catch (err) {
      console.debug('[Polling Saga]: Error during fetch', err);
    }
  };

  while (true) {
    try {
      console.debug(`[Polling Saga]: Initialising polling for ${url} every ${interval}ms `);

      // Fetch requested content
      const res = yield call(getRequest, url);
      const formated = factory ? factory(res) : res;

      // Calling succes action on request success
      yield put({
        type: successAction,
        result: formated
      });

      // Calling delay on request success
      yield call(delay, interval);
    } catch (err) {
      // Stop polling if an error is encounterd
      yield put({
        type: PollingActions.STOP
      });

      // Handle polled slice error gracefully
      yield put({
        type: errorAction,
        err
      });
    }
  }
}

export default function* pollingSagaWatcher() {
  while (true) {
    // Take the polling start dispatch action
    const action = yield take(PollingActions.START);

    // Payload will be available in action object
    yield race([call(pollingSaga, action.payload), take(PollingActions.STOP)]);
  }
}
