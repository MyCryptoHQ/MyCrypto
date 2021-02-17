import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, race, take, takeLatest } from 'redux-saga/effects';

export interface IPollingPayload {
  params: {
    interval: number;
    retryOnFailure?: boolean;
    retries?: number;
    retryAfter?: number;
  };
  successAction: any;
  errorAction?: any;
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
  yield takeLatest(pollStart.type, pollingSagaWatcher);
}

// @todo: Enhance polling
// @todo: Figure out multiple polling instances
export function* poll(payload: IPollingPayload) {
  const { promise, params, successAction, errorAction, transformer } = payload;

  const retriesCount = 0;

  console.debug(`[Polling Saga]: Initialising polling every ${params.interval}ms `);
  while (true) {
    try {
      // Fetch requested content
      const res = yield call(promise);
      const formatted = transformer ? transformer(res) : res;

      // Calling succes action on request success
      yield put(successAction(formatted));

      // Calling delay on request success
      yield delay(params.interval);
    } catch (err) {
      // Determine if the polling should retry on error
      const shouldRetry =
        params.retryOnFailure && params.retries ? retriesCount < params.retries : true;

      if (shouldRetry && params.retryAfter) {
        //

        console.debug(
          `[Polling Saga]: Polling encounterd an error, retrying after ${params.retryAfter}ms. Error: `,
          err
        );
        yield delay(params.retryAfter);
      } else if (!shouldRetry) {
        // Stop polling if an error is encounterd without retry

        console.debug(`[Polling Saga]: Polling encounterd an error, stopping with error: `, err);
        yield put(pollStop());
        if (errorAction) yield put(errorAction(err)); // Handle polling error gracefully
      } else
        console.debug(`[Polling Saga]: Polling encounterd an error, retrying now. Error: `, err);
    }
  }
}

export default function* pollingSagaWatcher({ payload }: PayloadAction<IPollingPayload>) {
  yield race([call(poll, payload), take(pollStop.type)]);
}
