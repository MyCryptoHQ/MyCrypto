import { createAction } from '@reduxjs/toolkit';
import { all, call, delay, put, race, take, takeLatest } from 'redux-saga/effects';

export interface IPollingPayload {
  params: {
    interval: number;
    retryOnFailure?: boolean;
    retries?: number;
    retriesAfter?: number;
  };
  successAction: any;
  //errorAction: string;
  promise(): Promise<any>;
  transformer?(result: any): any;
}

/**
 * Actions
 */

export const pollStart = createAction<IPollingPayload>(`polling/start`);
export const pollStop = createAction(`polling/stop`);
export const pollError = createAction(`polling/error`);

/**
 * Sagas
 */

export function* pollingSaga() {
  yield all([takeLatest(pollStart.type, pollingSagaWatcher)]);
}

// @todo: Replace with promise executed by poll
// @todo: Enhance polling
// @todo: Figure out multiple polling instances
export function* poll(payload: IPollingPayload) {
  const { promise, params, successAction, transformer } = payload;

  while (true) {
    try {
      console.debug(`[Polling Saga]: Initialising polling every ${params.interval}ms `);

      // Fetch requested content
      const res = yield call(promise);
      const formatted = transformer ? transformer(res) : res;

      // Calling succes action on request success
      yield put(successAction(formatted));

      // Calling delay on request success
      yield call(delay, params.interval);
    } catch (err) {
      // Stop polling if an error is encounterd
      yield put({
        type: pollStop.type
      });

      // Handle polled slice error gracefully
      // yield put({
      //   type: errorAction,
      //   err
      // });
    }
  }
}

export default function* pollingSagaWatcher() {
  // Take the polling start dispatch action
  const { payload } = yield take(pollStart.type);

  // Payload will be available in action object
  yield race([call(poll, payload), take(pollStop.type)]);
}
