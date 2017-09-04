// @flow
import { delay } from 'redux-saga';
import {
  call,
  put,
  fork,
  take,
  cancel,
  select,
  cancelled,
  takeEvery
} from 'redux-saga/effects';
import moment from 'moment';

import { showNotification } from 'actions/notifications';
import {
  orderTimeSwap,
  bityOrderCreateSucceededSwap,
  stopLoadBityRatesSwap,
  changeStepSwap,
  orderStatusRequestedSwap,
  orderStatusSucceededSwap,
  startOrderTimerSwap,
  startPollBityOrderStatus,
  stopPollBityOrderStatus
} from 'actions/swap';

import { postOrder, getOrderStatus } from 'api/bity';

import type { Yield, Return, Next } from 'sagas/types';
import type { State as SwapState } from 'reducers/swap';
import type { State } from 'reducers';
import type { BityOrderCreateRequestedSwapAction } from 'actions/swapTypes';

export const getSwap = (state: State): SwapState => state.swap;
const ONE_SECOND = 1000;
const TEN_SECONDS = ONE_SECOND * 10;
const BITY_TIMEOUT_MESSAGE = `
    Time has run out.
    If you have already sent, please wait 1 hour.
    If your order has not be processed after 1 hour,
    please press the orange 'Issue with your Swap?' button.
`;

export function* pollBityOrderStatus(): Generator<Yield, Return, Next> {
  try {
    let swap = yield select(getSwap);
    while (true) {
      yield put(orderStatusRequestedSwap());
      const orderStatus = yield call(getOrderStatus, swap.orderId);
      if (orderStatus.error) {
        yield put(
          showNotification(
            'danger',
            `Bity Error: ${orderStatus.msg}`,
            TEN_SECONDS
          )
        );
      } else {
        yield put(orderStatusSucceededSwap(orderStatus.data));
        yield call(delay, ONE_SECOND * 5);
        swap = yield select(getSwap);
        if (swap === 'CANC') {
          break;
        }
      }
    }
  } finally {
    if (yield cancelled()) {
      // TODO - implement request cancel if needed
      // yield put(actions.requestFailure('Request cancelled!'))
    }
  }
}

export function* pollBityOrderStatusSaga(): Generator<Yield, Return, Next> {
  while (yield take('SWAP_START_POLL_BITY_ORDER_STATUS')) {
    // starts the task in the background
    const pollBityOrderStatusTask = yield fork(pollBityOrderStatus);
    // wait for the user to get to point where refresh is no longer needed
    yield take('SWAP_STOP_POLL_BITY_ORDER_STATUS');
    // cancel the background task
    // this will cause the forked loadBityRates task to jump into its finally block
    yield cancel(pollBityOrderStatusTask);
  }
}

function* postBityOrderCreate(
  action: BityOrderCreateRequestedSwapAction
): Generator<Yield, Return, Next> {
  const payload = action.payload;
  try {
    yield put(stopLoadBityRatesSwap());
    const order = yield call(
      postOrder,
      payload.amount,
      payload.destAddress,
      payload.mode,
      payload.pair
    );
    if (order.error) {
      // TODO - handle better / like existing site?
      yield put(
        showNotification('danger', `Bity Error: ${order.msg}`, TEN_SECONDS)
      );
      yield put({ type: 'SWAP_ORDER_CREATE_FAILED' });
    } else {
      yield put(bityOrderCreateSucceededSwap(order.data));
      yield put(changeStepSwap(3));
      // start countdown
      yield put(startOrderTimerSwap());
      // start bity order status polling
      yield put(startPollBityOrderStatus());
    }
  } catch (e) {
    const message =
      'Connection Error. Please check the developer console for more details and/or contact support';
    yield put(showNotification('danger', message, TEN_SECONDS));
    yield put({ type: 'SWAP_ORDER_CREATE_FAILED' });
  }
}

export function* postBityOrderSaga(): Generator<Yield, Return, Next> {
  yield takeEvery('SWAP_ORDER_CREATE_REQUESTED', postBityOrderCreate);
}

export function* bityTimeRemaining(): Generator<Yield, Return, Next> {
  while (yield take('SWAP_ORDER_START_TIMER')) {
    let hasShownNotification = false;
    while (true) {
      yield call(delay, ONE_SECOND);
      const swap = yield select(getSwap);
      // if (swap.bityOrder.status === 'OPEN') {
      const createdTimeStampMoment = moment(
        swap.orderTimestampCreatedISOString
      );
      let validUntil = moment(createdTimeStampMoment).add(swap.validFor, 's');
      let now = moment();
      if (validUntil.isAfter(now)) {
        let duration = moment.duration(validUntil.diff(now));
        let seconds = duration.asSeconds();
        yield put(orderTimeSwap(parseInt(seconds)));
        // TODO (!Important) - check orderStatus here and stop polling / show notifications based on status
      } else {
        switch (swap.orderStatus) {
          case 'OPEN':
            yield put(orderTimeSwap(0));
            yield put(stopPollBityOrderStatus());
            yield put({ type: 'SWAP_STOP_LOAD_BITY_RATES' });
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(
                showNotification('danger', BITY_TIMEOUT_MESSAGE, 'infinity')
              );
            }
            break;
          case 'CANC':
            yield put(stopPollBityOrderStatus());
            yield put({ type: 'SWAP_STOP_LOAD_BITY_RATES' });
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(
                showNotification('danger', BITY_TIMEOUT_MESSAGE, 'infinity')
              );
            }
            break;
          case 'RCVE':
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(
                showNotification('warning', BITY_TIMEOUT_MESSAGE, 'infinity')
              );
            }
            break;
          case 'FILL':
            yield put(stopPollBityOrderStatus());
            yield put({ type: 'SWAP_STOP_LOAD_BITY_RATES' });
            break;
        }
      }
    }
  }
}
