import { showNotification } from 'actions/notifications';
import { delay } from 'redux-saga';
import { postOrder, getOrderStatus } from 'api/bity';
import {
  call,
  put,
  fork,
  take,
  cancel,
  select,
  cancelled,
  takeEvery,
  Effect
} from 'redux-saga/effects';
import {
  orderTimeTickSwap,
  orderCreateSucceededSwap,
  stopLoadBityRatesSwap,
  changeStepSwap,
  orderStatusRequestedSwap,
  orderStatusSucceededSwap,
  startOrderTimerSwap,
  startPollBityOrderStatus
} from 'actions/swap';

export const getSwap = state => state.swap;
const ONE_SECOND = 1000;
const TEN_SECONDS = ONE_SECOND * 10;
const BITY_TIMEOUT_MESSAGE = `
    Time has run out. 
    If you have already sent, please wait 1 hour. 
    If your order has not be processed after 1 hour, 
    please press the orange 'Issue with your Swap?' button.
`;

export function* pollBityOrderStatus(): Generator<Effect, void, any> {
  try {
    let swap = yield select(getSwap);
    while (true) {
      yield put(orderStatusRequestedSwap());
      const orderStatus = yield call(getOrderStatus, swap.orderId);
      if (orderStatus.error) {
        yield put(
          showNotification('danger', `Bity Error: ${orderStatus.msg}`, 10000)
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

export function* pollBityOrderStatusSaga(): Generator<Effect, void, any> {
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

function* postOrderCreate(action) {
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
      yield put(showNotification('danger', `Bity Error: ${order.msg}`, 10000));
      yield put({ type: 'SWAP_ORDER_CREATE_FAILED' });
    } else {
      yield put(orderCreateSucceededSwap(order.data));
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

export function* postBityOrderSaga(): Generator<Effect, void, any> {
  yield takeEvery('SWAP_ORDER_CREATE_REQUESTED', postOrderCreate);
}

export function* bityTimeRemaining() {
  while (yield take('SWAP_ORDER_START_TIMER')) {
    while (true) {
      yield call(delay, ONE_SECOND);
      const swap = yield select(getSwap);
      if (swap.bityOrder.status === 'OPEN') {
        if (swap.secondsRemaining > 0) {
          yield put(orderTimeTickSwap());
        } else {
          yield put(showNotification('danger', BITY_TIMEOUT_MESSAGE, 0)); // 0 is forever
          break;
        }
      } else {
        // stop dispatching time tick
        break;
      }
    }
  }
}
