import { showNotification } from 'actions/notifications';
import {
  bityOrderCreateFailedSwap,
  BityOrderCreateRequestedSwapAction,
  bityOrderCreateSucceededSwap,
  changeStepSwap,
  orderTimeSwap,
  startOrderTimerSwap,
  startPollBityOrderStatus,
  stopLoadBityRatesSwap,
  stopPollBityOrderStatus,
  shapeshiftOrderStatusSucceededSwap,
  ShapeshiftOrderCreateRequestedSwapAction,
  stopLoadShapeshiftRatesSwap,
  shapeshiftOrderCreateFailedSwap,
  shapeshiftOrderCreateSucceededSwap,
  startPollShapeshiftOrderStatus,
  stopPollShapeshiftOrderStatus,
  bityOrderStatusRequested,
  stopOrderTimerSwap,
  bityOrderStatusSucceededSwap,
  shapeshiftOrderStatusRequested,
  loadShapeshiftRatesRequestedSwap
} from 'actions/swap';
import { getOrderStatus, postOrder } from 'api/bity';
import moment from 'moment';
import { AppState } from 'reducers';
import { State as SwapState } from 'reducers/swap';
import { delay, SagaIterator } from 'redux-saga';
import {
  call,
  cancel,
  apply,
  cancelled,
  fork,
  put,
  select,
  take,
  takeEvery
} from 'redux-saga/effects';
import shapeshift from 'api/shapeshift';
import { TypeKeys } from 'actions/swap/constants';
import { resetWallet } from 'actions/wallet';
import { reset } from 'actions/transaction';

export const getSwap = (state: AppState): SwapState => state.swap;
const ONE_SECOND = 1000;
const TEN_SECONDS = ONE_SECOND * 10;
export const ORDER_TIMEOUT_MESSAGE = `
    Time has run out.
    If you have already sent, please wait 1 hour.
    If your order has not be processed after 1 hour,
    please press the orange 'Issue with your Swap?' button.
`;

export const ORDER_RECEIVED_MESSAGE = `
    The order was recieved.
    It may take some time to process the transaction.
    Please wait 1 hour. If your order has not been processed by then,
    please press the orange 'Issue with your Swap?' button.
`;

export function* pollBityOrderStatus(): SagaIterator {
  try {
    let swap = yield select(getSwap);
    while (true) {
      yield put(bityOrderStatusRequested());
      const orderStatus = yield call(getOrderStatus, swap.orderId);
      if (orderStatus.error) {
        yield put(showNotification('danger', `Bity Error: ${orderStatus.msg}`, TEN_SECONDS));
      } else {
        yield put(bityOrderStatusSucceededSwap(orderStatus.data));
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

export function* pollShapeshiftOrderStatus(): SagaIterator {
  try {
    let swap = yield select(getSwap);
    while (true) {
      yield put(shapeshiftOrderStatusRequested());
      const orderStatus = yield apply(shapeshift, shapeshift.checkStatus, [swap.paymentAddress]);
      if (orderStatus.status === 'failed') {
        yield put(showNotification('danger', `Shapeshift Error: ${orderStatus.error}`, Infinity));
        yield put(stopPollShapeshiftOrderStatus());
      } else {
        yield put(shapeshiftOrderStatusSucceededSwap(orderStatus));
        yield call(delay, ONE_SECOND * 5);
        swap = yield select(getSwap);
        if (swap === 'CANC') {
          break;
        }
      }
    }
  } finally {
    if (yield cancelled()) {
      // Request canclled
    }
  }
}

export function* pollBityOrderStatusSaga(): SagaIterator {
  while (yield take(TypeKeys.SWAP_START_POLL_BITY_ORDER_STATUS)) {
    // starts the task in the background
    const pollBityOrderStatusTask = yield fork(pollBityOrderStatus);
    // wait for the user to get to point where refresh is no longer needed
    yield take(TypeKeys.SWAP_STOP_POLL_BITY_ORDER_STATUS);
    // cancel the background task
    // this will cause the forked loadBityRates task to jump into its finally block
    yield cancel(pollBityOrderStatusTask);
  }
}

export function* pollShapeshiftOrderStatusSaga(): SagaIterator {
  while (yield take(TypeKeys.SWAP_START_POLL_SHAPESHIFT_ORDER_STATUS)) {
    const pollShapeshiftOrderStatusTask = yield fork(pollShapeshiftOrderStatus);
    yield take(TypeKeys.SWAP_STOP_POLL_SHAPESHIFT_ORDER_STATUS);
    yield cancel(pollShapeshiftOrderStatusTask);
  }
}

export function* postBityOrderCreate(action: BityOrderCreateRequestedSwapAction): SagaIterator {
  const payload = action.payload;
  try {
    yield put(stopLoadBityRatesSwap());
    const order = yield call(
      postOrder,
      payload.amount,
      payload.destinationAddress,
      payload.mode,
      payload.pair
    );
    if (order.error) {
      // TODO - handle better / like existing site?
      yield put(showNotification('danger', `Bity Error: ${order.msg}`, TEN_SECONDS));
      yield put(bityOrderCreateFailedSwap());
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
    console.error(e);
    yield put(showNotification('danger', message, TEN_SECONDS));
    yield put(bityOrderCreateFailedSwap());
  }
}

export function* postShapeshiftOrderCreate(
  action: ShapeshiftOrderCreateRequestedSwapAction
): SagaIterator {
  const payload = action.payload;
  try {
    yield put(stopLoadShapeshiftRatesSwap());
    const order = yield apply(shapeshift, shapeshift.sendAmount, [
      payload.withdrawal,
      payload.originKind,
      payload.destinationKind,
      payload.destinationAmount
    ]);
    if (order.error) {
      yield put(showNotification('danger', `Shapeshift Error: ${order.error}`, TEN_SECONDS));
      yield put(shapeshiftOrderCreateFailedSwap());
    } else {
      yield put(shapeshiftOrderCreateSucceededSwap(order.success));
      yield put(changeStepSwap(3));
      // start countdown
      yield put(startOrderTimerSwap());
      // start shapeshift order status polling
      yield put(startPollShapeshiftOrderStatus());
    }
  } catch (e) {
    if (e && e.message) {
      yield put(showNotification('danger', e.message, TEN_SECONDS));
    } else {
      const message =
        'Connection Error. Please check the developer console for more details and/or contact support';
      console.error(e);
      yield put(showNotification('danger', message, TEN_SECONDS));
    }
    yield put(shapeshiftOrderCreateFailedSwap());
  }
}

export function* postBityOrderSaga(): SagaIterator {
  yield takeEvery(TypeKeys.SWAP_BITY_ORDER_CREATE_REQUESTED, postBityOrderCreate);
}

export function* postShapeshiftOrderSaga(): SagaIterator {
  yield takeEvery(TypeKeys.SWAP_SHAPESHIFT_ORDER_CREATE_REQUESTED, postShapeshiftOrderCreate);
}

export function* restartSwap() {
  yield put(reset());
  yield put(resetWallet());
  yield put(stopPollShapeshiftOrderStatus());
  yield put(stopPollBityOrderStatus());
  yield put(loadShapeshiftRatesRequestedSwap());
}

export function* restartSwapSaga(): SagaIterator {
  yield takeEvery(TypeKeys.SWAP_RESTART, restartSwap);
}

export function* bityOrderTimeRemaining(): SagaIterator {
  while (true) {
    let hasShownNotification = false;
    while (true) {
      yield call(delay, ONE_SECOND);
      const swap = yield select(getSwap);
      const createdTimeStampMoment = moment(swap.orderTimestampCreatedISOString);
      const validUntil = moment(createdTimeStampMoment).add(swap.validFor, 's');
      const now = moment();
      if (validUntil.isAfter(now)) {
        const duration = moment.duration(validUntil.diff(now));
        const seconds = duration.asSeconds();
        yield put(orderTimeSwap(parseInt(seconds.toString(), 10)));

        switch (swap.bityOrderStatus) {
          case 'CANC':
            yield put(stopPollBityOrderStatus());
            yield put(stopLoadBityRatesSwap());
            yield put(stopOrderTimerSwap());
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(showNotification('danger', ORDER_TIMEOUT_MESSAGE, Infinity));
            }
            break;
          case 'FILL':
            yield put(stopPollBityOrderStatus());
            yield put(stopLoadBityRatesSwap());
            yield put(stopOrderTimerSwap());
            break;
        }
      } else {
        switch (swap.bityOrderStatus) {
          case 'OPEN':
            yield put(orderTimeSwap(0));
            yield put(stopPollBityOrderStatus());
            yield put(stopLoadBityRatesSwap());
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(showNotification('danger', ORDER_TIMEOUT_MESSAGE, Infinity));
            }
            break;
          case 'CANC':
            yield put(stopPollBityOrderStatus());
            yield put(stopLoadBityRatesSwap());
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(showNotification('danger', ORDER_TIMEOUT_MESSAGE, Infinity));
            }
            break;
          case 'RCVE':
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(showNotification('warning', ORDER_TIMEOUT_MESSAGE, Infinity));
            }
            break;
          case 'FILL':
            yield put(stopPollBityOrderStatus());
            yield put(stopLoadBityRatesSwap());
            yield put(stopOrderTimerSwap());
            break;
        }
      }
    }
  }
}

export function* shapeshiftOrderTimeRemaining(): SagaIterator {
  while (true) {
    let hasShownNotification = false;
    while (true) {
      yield call(delay, ONE_SECOND);
      const swap = yield select(getSwap);
      const createdTimeStampMoment = moment(swap.orderTimestampCreatedISOString);
      const validUntil = moment(createdTimeStampMoment).add(swap.validFor, 's');
      const now = moment();
      if (validUntil.isAfter(now)) {
        const duration = moment.duration(validUntil.diff(now));
        const seconds = duration.asSeconds();
        yield put(orderTimeSwap(parseInt(seconds.toString(), 10)));
        switch (swap.shapeshiftOrderStatus) {
          case 'failed':
            yield put(stopPollShapeshiftOrderStatus());
            yield put(stopLoadShapeshiftRatesSwap());
            yield put(stopOrderTimerSwap());
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(showNotification('danger', ORDER_TIMEOUT_MESSAGE, Infinity));
            }
            break;
          case 'received':
            yield put(stopOrderTimerSwap());
            break;
          case 'complete':
            yield put(stopPollShapeshiftOrderStatus());
            yield put(stopLoadShapeshiftRatesSwap());
            yield put(stopOrderTimerSwap());
            break;
        }
      } else {
        switch (swap.shapeshiftOrderStatus) {
          case 'no_deposits':
            yield put(orderTimeSwap(0));
            yield put(stopPollShapeshiftOrderStatus());
            yield put(stopLoadShapeshiftRatesSwap());
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(showNotification('danger', ORDER_TIMEOUT_MESSAGE, Infinity));
            }
            break;
          case 'failed':
            yield put(stopPollShapeshiftOrderStatus());
            yield put(stopLoadShapeshiftRatesSwap());
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(showNotification('danger', ORDER_TIMEOUT_MESSAGE, Infinity));
            }
            break;
          case 'received':
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(showNotification('warning', ORDER_RECEIVED_MESSAGE, Infinity));
            }
            break;
          case 'complete':
            yield put(stopPollShapeshiftOrderStatus());
            yield put(stopLoadShapeshiftRatesSwap());
            yield put(stopOrderTimerSwap());
            break;
        }
      }
    }
  }
}

export function* handleOrderTimeRemaining(): SagaIterator {
  const swap = yield select(getSwap);
  let orderTimeRemainingTask;
  if (swap.provider === 'shapeshift') {
    orderTimeRemainingTask = yield fork(shapeshiftOrderTimeRemaining);
  } else {
    orderTimeRemainingTask = yield fork(bityOrderTimeRemaining);
  }
  yield take(TypeKeys.SWAP_ORDER_STOP_TIMER);
  yield cancel(orderTimeRemainingTask);
}

export function* swapTimerSaga(): SagaIterator {
  yield takeEvery(TypeKeys.SWAP_ORDER_START_TIMER, handleOrderTimeRemaining);
}
