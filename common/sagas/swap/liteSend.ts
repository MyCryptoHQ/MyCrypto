import { SagaIterator, delay, takeEvery } from 'redux-saga';
import { select, put, call, take, race, fork, cancel } from 'redux-saga/effects';
import { getOrigin, getPaymentAddress } from 'selectors/swap';
import {
  setUnitMeta,
  setCurrentTo,
  setCurrentValue,
  TypeKeys as TransactionTK,
  reset
} from 'actions/transaction';
import { TypeKeys as WalletTK, setTokenBalancePending } from 'actions/wallet';
import { AppState } from 'reducers';
import { showNotification } from 'actions/notifications';
import { tokenExists } from 'selectors/config';
import { isEtherUnit } from 'libs/units';
import { showLiteSend } from 'actions/swap';
import { TypeKeys as SwapTK } from 'actions/swap/constants';
import { isUnlocked } from 'selectors/wallet';

type SwapState = AppState['swap'];

function* configureLiteSend(): SagaIterator {
  const { amount, id }: SwapState['origin'] = yield select(getOrigin);
  const paymentAddress: SwapState['paymentAddress'] = yield call(fetchPaymentAddress);

  if (!paymentAddress) {
    yield put(showNotification('danger', 'Could not fetch payment address'));
    return yield put(showLiteSend(false));
  }

  const supportedUnit: boolean = yield call(isSupportedUnit, id);
  if (!supportedUnit) {
    return yield put(showLiteSend(false));
  }

  const unlocked: boolean = yield select(isUnlocked);
  yield put(showLiteSend(true));

  // wait for wallet to be unlocked to continue
  if (!unlocked) {
    yield take(WalletTK.WALLET_SET);
  }

  //if it's a token, manually scan for that tokens balance and wait for it to resolve
  if (!isEtherUnit(id)) {
    yield put(setTokenBalancePending({ tokenSymbol: id }));
    yield take([
      WalletTK.WALLET_SET_TOKEN_BALANCE_FULFILLED,
      WalletTK.WALLET_SET_TOKEN_BALANCE_REJECTED
    ]);
  }

  yield put(setUnitMeta(id));
  yield put(setCurrentValue(amount.toString()));
  yield put(setCurrentTo(paymentAddress));
}

function* handleConfigureLiteSend(): SagaIterator {
  while (true) {
    const liteSendProc = yield fork(configureLiteSend);
    const result = yield race({
      transactionReset: take(TransactionTK.RESET),
      userNavigatedAway: take(WalletTK.WALLET_RESET),
      bityPollingFinshed: take(SwapTK.SWAP_STOP_POLL_BITY_ORDER_STATUS),
      shapeshiftPollingFinished: take(SwapTK.SWAP_STOP_POLL_SHAPESHIFT_ORDER_STATUS)
    });

    //if polling is finished we should clear state and hide this tab
    if (result.bityPollingFinshed || result.shapeshiftPollingFinished) {
      //clear transaction state and cancel saga
      yield cancel(liteSendProc);
      yield put(showLiteSend(false));
      return yield put(reset());
    }
    if (result.transactionReset) {
      yield cancel(liteSendProc);
    }

    // if wallet reset is called, that means the user navigated away from the page, so we cancel everything
    if (result.userNavigatedAway) {
      yield cancel(liteSendProc);
      return yield put(showLiteSend(false));
    }
    // else the user just swapped to a new wallet, and we'll race against liteSend again to re-apply
    // the same transaction parameters again
  }
}

function* fetchPaymentAddress() {
  const MAX_RETRIES = 5;
  let currentTry = 0;
  while (currentTry <= MAX_RETRIES) {
    yield delay(500);
    const paymentAddress: SwapState['paymentAddress'] = yield select(getPaymentAddress);
    if (paymentAddress) {
      return paymentAddress;
    }
    currentTry++;
  }
  yield put(showNotification('danger', 'Payment address not found'));
  return false;
}

function* isSupportedUnit(unit: string) {
  const isToken: boolean = yield select(tokenExists, unit);
  const isEther: boolean = yield call(isEtherUnit, unit);
  if (!isToken && !isEther) {
    return false;
  }
  return true;
}

export function* liteSend() {
  yield takeEvery(SwapTK.SWAP_CONFIGURE_LITE_SEND, handleConfigureLiteSend);
}
