import { SagaIterator, delay } from 'redux-saga';
import {
  call,
  cancel,
  apply,
  cancelled,
  fork,
  put,
  select,
  take,
  takeEvery,
  race,
  takeLatest
} from 'redux-saga/effects';
import moment from 'moment';

import { getOrderStatus, postOrder, getAllRates } from 'api/bity';
import shapeshift from 'api/shapeshift';
import {
  TypeKeys as TransactionTypeKeys,
  setUnitMeta,
  setCurrentTo,
  setCurrentValue,
  resetTransactionRequested
} from 'features/transaction';
import { isSupportedUnit, isNetworkUnit } from 'features/config';
import {
  WALLET,
  setTokenBalancePending,
  resetWallet,
  isUnlocked,
  isEtherBalancePending
} from 'features/wallet';
import { showNotification } from 'features/notifications';
import {
  SWAP,
  BityOrderCreateRequestedSwapAction,
  ShapeshiftOrderCreateRequestedSwapAction,
  ChangeProviderSwapAcion,
  SwapState
} from './types';
import {
  bityOrderCreateFailedSwap,
  bityOrderCreateSucceededSwap,
  changeStepSwap,
  orderTimeSwap,
  startOrderTimerSwap,
  startPollBityOrderStatus,
  stopLoadBityRatesSwap,
  stopPollBityOrderStatus,
  shapeshiftOrderStatusSucceededSwap,
  stopLoadShapeshiftRatesSwap,
  shapeshiftOrderCreateFailedSwap,
  shapeshiftOrderCreateSucceededSwap,
  startPollShapeshiftOrderStatus,
  stopPollShapeshiftOrderStatus,
  bityOrderStatusRequested,
  stopOrderTimerSwap,
  bityOrderStatusSucceededSwap,
  shapeshiftOrderStatusRequested,
  loadShapeshiftRatesRequestedSwap,
  loadBityRatesSucceededSwap,
  loadShapeshiftRatesSucceededSwap,
  loadBityRatesFailedSwap,
  loadShapeshiftRatesFailedSwap,
  changeSwapProvider,
  showLiteSend,
  configureLiteSend
} from './actions';
import { getSwap, getOrigin, getPaymentAddress, getHasNotifiedRatesFailure } from './selectors';

//#region Lite Send
export function* configureLiteSendSaga(): SagaIterator {
  const { amount, label }: SwapState['origin'] = yield select(getOrigin);
  const paymentAddress: SwapState['paymentAddress'] = yield call(fetchPaymentAddress);

  if (!paymentAddress) {
    yield put(showNotification('danger', 'Could not fetch payment address'));
    return yield put(showLiteSend(false));
  }

  const supportedUnit: boolean = yield select(isSupportedUnit, label);
  if (!supportedUnit) {
    return yield put(showLiteSend(false));
  }

  const unlocked: boolean = yield select(isUnlocked);
  yield put(showLiteSend(true));

  // wait for wallet to be unlocked to continue
  if (!unlocked) {
    yield take(WALLET.SET);
  }
  const isNetwrkUnit = yield select(isNetworkUnit, label);
  //if it's a token, manually scan for that tokens balance and wait for it to resolve
  if (!isNetwrkUnit) {
    yield put(setTokenBalancePending({ tokenSymbol: label }));
    yield take([WALLET.SET_TOKEN_BALANCE_FULFILLED, WALLET.SET_TOKEN_BALANCE_REJECTED]);
  } else {
    const etherBalanceResolving: boolean = yield select(isEtherBalancePending);
    if (etherBalanceResolving) {
      yield take([WALLET.SET_BALANCE_FULFILLED, WALLET.SET_BALANCE_REJECTED]);
    }
  }

  yield put(setUnitMeta(label));
  yield put(setCurrentValue(amount.toString()));
  yield put(setCurrentTo(paymentAddress));
}

export function* handleConfigureLiteSend(): SagaIterator {
  while (true) {
    const liteSendProc = yield fork(configureLiteSendSaga);
    const result = yield race({
      transactionReset: take(TransactionTypeKeys.RESET_REQUESTED),
      userNavigatedAway: take(WALLET.RESET),
      bityPollingFinished: take(SWAP.STOP_POLL_BITY_ORDER_STATUS),
      shapeshiftPollingFinished: take(SWAP.STOP_POLL_SHAPESHIFT_ORDER_STATUS)
    });

    //if polling is finished we should clear state and hide this tab
    if (result.bityPollingFinished || result.shapeshiftPollingFinished) {
      //clear transaction state and cancel saga
      yield cancel(liteSendProc);
      yield put(showLiteSend(false));
      return yield put(resetTransactionRequested());
    }
    if (result.transactionReset) {
      yield cancel(liteSendProc);
    }

    // if wallet reset is called, that means the user navigated away from the page, so we cancel everything
    if (result.userNavigatedAway) {
      yield cancel(liteSendProc);
      yield put(showLiteSend(false));
      return yield put(configureLiteSend());
    }
    // else the user just swapped to a new wallet, and we'll race against liteSend again to re-apply
    // the same transaction parameters again
  }
}

export function* fetchPaymentAddress(): SagaIterator {
  const MAX_RETRIES = 5;
  let currentTry = 0;
  while (currentTry <= MAX_RETRIES) {
    yield call(delay, 500);
    const paymentAddress: SwapState['paymentAddress'] = yield select(getPaymentAddress);
    if (paymentAddress) {
      return paymentAddress;
    }
    currentTry++;
  }

  yield put(showNotification('danger', 'Payment address not found'));
  return false;
}

export function* swapLiteSendSaga(): SagaIterator {
  yield takeEvery(SWAP.CONFIGURE_LITE_SEND, handleConfigureLiteSend);
}
//#endregion Lite Send

//#region Orders
export const ONE_SECOND = 1000;
export const TEN_SECONDS = ONE_SECOND * 10;
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
  while (yield take(SWAP.START_POLL_BITY_ORDER_STATUS)) {
    // starts the task in the background
    const pollBityOrderStatusTask = yield fork(pollBityOrderStatus);
    // wait for the user to get to point where refresh is no longer needed
    yield take(SWAP.STOP_POLL_BITY_ORDER_STATUS);
    // cancel the background task
    // this will cause the forked loadBityRates task to jump into its finally block
    yield cancel(pollBityOrderStatusTask);
  }
}

export function* pollShapeshiftOrderStatusSaga(): SagaIterator {
  while (yield take(SWAP.START_POLL_SHAPESHIFT_ORDER_STATUS)) {
    const pollShapeshiftOrderStatusTask = yield fork(pollShapeshiftOrderStatus);
    yield take(SWAP.STOP_POLL_SHAPESHIFT_ORDER_STATUS);
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

export function* restartSwapSaga() {
  yield put(resetWallet());
  yield put(stopPollShapeshiftOrderStatus());
  yield put(stopPollBityOrderStatus());
  yield put(loadShapeshiftRatesRequestedSwap());
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
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(orderTimeSwap(0));
              yield put(stopPollShapeshiftOrderStatus());
              yield put(stopLoadShapeshiftRatesSwap());
              yield put(showNotification('danger', ORDER_TIMEOUT_MESSAGE, Infinity));
            }
            break;
          case 'failed':
            if (!hasShownNotification) {
              hasShownNotification = true;
              yield put(stopPollShapeshiftOrderStatus());
              yield put(stopLoadShapeshiftRatesSwap());
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
  yield take(SWAP.ORDER_STOP_TIMER);
  yield cancel(orderTimeRemainingTask);
}

export function* swapOrdersSaga(): SagaIterator {
  yield fork(handleOrderTimeRemaining);
  yield fork(pollShapeshiftOrderStatusSaga);
  yield fork(pollBityOrderStatusSaga);
  yield takeEvery(SWAP.BITY_ORDER_CREATE_REQUESTED, postBityOrderCreate);
  yield takeEvery(SWAP.SHAPESHIFT_ORDER_CREATE_REQUESTED, postShapeshiftOrderCreate);
  yield takeEvery(SWAP.ORDER_START_TIMER, handleOrderTimeRemaining);
  yield takeEvery(SWAP.RESTART, restartSwapSaga);
}
//#endregion Orders

//#region Rates
export const SHAPESHIFT_TIMEOUT = 10000;
export const POLLING_CYCLE = 30000;

export function* loadBityRates(): SagaIterator {
  while (true) {
    try {
      const data = yield call(getAllRates);
      yield put(loadBityRatesSucceededSwap(data));
    } catch (error) {
      const hasNotified = yield select(getHasNotifiedRatesFailure);
      if (!hasNotified) {
        console.error('Failed to load rates from Bity:', error);
        yield put(showNotification('danger', error.message));
      }
      yield put(loadBityRatesFailedSwap());
    }
    yield call(delay, POLLING_CYCLE);
  }
}

export function* handleBityRates(): SagaIterator {
  const loadBityRatesTask = yield fork(loadBityRates);
  yield take(SWAP.STOP_LOAD_BITY_RATES);
  yield cancel(loadBityRatesTask);
}

export function* loadShapeshiftRates(): SagaIterator {
  while (true) {
    try {
      // Race b/w api call and timeout
      // getShapeShiftRates should be an api call that accepts a whitelisted arr of symbols
      const { tokens } = yield race({
        tokens: call(shapeshift.getAllRates),
        timeout: call(delay, SHAPESHIFT_TIMEOUT)
      });
      // If tokens exist, put it into the redux state, otherwise switch to bity.
      if (tokens) {
        yield put(loadShapeshiftRatesSucceededSwap(tokens));
      } else {
        throw new Error('ShapeShift rates request timed out.');
      }
    } catch (error) {
      const hasNotified = yield select(getHasNotifiedRatesFailure);
      if (!hasNotified) {
        console.error('Failed to fetch rates from shapeshift:', error);
        yield put(
          showNotification(
            'danger',
            'Failed to load swap rates from ShapeShift, please try again later'
          )
        );
      }
      yield put(loadShapeshiftRatesFailedSwap());
    }
    yield call(delay, POLLING_CYCLE);
  }
}

export function* handleShapeshiftRates(): SagaIterator {
  const loadShapeshiftRatesTask = yield fork(loadShapeshiftRates);
  yield take(SWAP.STOP_LOAD_SHAPESHIFT_RATES);
  yield cancel(loadShapeshiftRatesTask);
}

export function* swapProvider(action: ChangeProviderSwapAcion): SagaIterator {
  const swap = yield select(getSwap);
  if (swap.provider !== action.payload) {
    yield put(changeSwapProvider(action.payload));
  }
}

export function* swapRatesSaga(): SagaIterator {
  yield takeLatest(SWAP.LOAD_BITY_RATES_REQUESTED, handleBityRates);
  yield takeLatest(SWAP.LOAD_SHAPESHIFT_RATES_REQUESTED, handleShapeshiftRates);
  yield takeLatest(SWAP.CHANGE_PROVIDER, swapProvider);
}
//#endregion Rates
