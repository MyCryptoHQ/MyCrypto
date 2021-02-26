import {
  ActionCreatorWithOptionalPayload,
  ActionCreatorWithPayload,
  createAction,
  PayloadAction
} from '@reduxjs/toolkit';
import { call, delay, put, race, take, takeLatest } from 'redux-saga/effects';

export interface IPollingPayload {
  params: {
    interval: number;
    retryOnFailure?: boolean;
    retries?: number;
    retryAfter?: number;
  };
  successAction: ActionCreatorWithPayload<any, string>;
  errorAction?: ActionCreatorWithOptionalPayload<any, string>;
  promise(): Promise<any>;
  transformer?(result: any): any;
}

/**
 * Actions
 */

export const pollStart = createAction<IPollingPayload>(`polling/start`);
export const pollStop = createAction(`polling/stop`);

/**
 * Sagas
 */

export function* pollingSaga() {
  yield takeLatest(pollStart.type, pollingSagaWatcher);
}

// @todo: Figure out multiple polling instances
export function* pollingWorker(payload: IPollingPayload) {
  const { promise, params, successAction, errorAction, transformer } = payload;

  let retriesCount = 0;

  console.debug(`[Polling Saga]: Initialising polling every ${params.interval}ms `);
  while (true) {
    try {
      const res = yield call(promise); // Fetch requested content
      const formatted = transformer ? transformer(res) : res;

      yield put(successAction(formatted)); // Calling succes action on request success

      yield delay(params.interval); // Calling delay on request success
    } catch (err) {
      const shouldRetry =
        params.retryOnFailure && params.retries ? retriesCount < params.retries : false; // Determine if the polling should retry on error

      if (shouldRetry && params.retryAfter) {
        ++retriesCount;
        console.debug(
          `[Polling Saga]: Polling encounterd an error, retrying the ${
            retriesCount + 1
          } time after ${params.retryAfter}ms. Error: `,
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
  yield race([call(pollingWorker, payload), take(pollStop.type)]);
}
