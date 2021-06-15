import { PayloadActionCreator } from '@reduxjs/toolkit';
import { call, delay, put, race, take, takeLatest } from 'redux-saga/effects';

export interface IPollingPayload {
  startAction: PayloadActionCreator;
  stopAction: PayloadActionCreator;
  params: {
    interval: number;
    retryOnFailure?: boolean;
    retries?: number;
    retryAfter?: number;
  };
  saga(): Generator<any, void, unknown>;
}

/**
 * Sagas
 */

export function* pollingSaga(payload: IPollingPayload) {
  yield takeLatest(payload.startAction.type, pollingSagaWatcher, payload);
}

// @todo: Figure out multiple polling instances
export function* pollingWorker(payload: IPollingPayload) {
  const { startAction, stopAction, saga, params } = payload;

  let retriesCount = 0;

  console.debug(`[${startAction.type}]: Initialising polling for every ${params.interval}ms `);
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
          `[${startAction.type}]: Polling encounterd an error, retrying the ${
            retriesCount + 1
          } time after ${params.retryAfter}ms. Error: `,
          err
        );

        yield delay(params.retryAfter);
      } else if (!shouldRetry) {
        // Stop polling if an error is encounterd without retry
        console.debug(
          `[${startAction.type}]: Polling encounterd an error, stopping with error: `,
          err
        );
        yield put(stopAction());
      } else {
        ++retriesCount;
        console.debug(
          `[${startAction.type}]: Polling encounterd an error, retrying now. Error: `,
          err
        );
      }
    }
  }
}

export default function* pollingSagaWatcher(payload: IPollingPayload) {
  yield race([call(pollingWorker, payload), take(payload.stopAction.type)]);
}
