import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, race, take, takeLatest } from 'redux-saga/effects';

export interface IPollingPayload {
  params: {
    interval: number;
    retryOnFailure?: boolean;
    retries?: number;
    retryAfter?: number;
  };
  saga(): Generator<any, void, unknown>;
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
  const { saga, params } = payload;

  let retriesCount = 0;

  console.debug(`[Polling Saga]: Initialising polling every ${params.interval}ms `);
  while (true) {
    try {
      yield call(saga); // Fetch requested content
      yield delay(params.interval); // Calling delay after request success
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
      } else
        console.debug(`[Polling Saga]: Polling encounterd an error, retrying now. Error: `, err);
    }
  }
}

export default function* pollingSagaWatcher({ payload }: PayloadAction<IPollingPayload>) {
  yield race([call(pollingWorker, payload), take(pollStop.type)]);
}
