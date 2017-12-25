import { SagaIterator, delay, takeEvery } from 'redux-saga';
import { select, put, call, take, race, cancelled } from 'redux-saga/effects';
import { getOrigin, getPaymentAddress } from 'selectors/swap';
import { setUnitMeta, setCurrentTo, setCurrentValue } from 'actions/transaction';
import { TypeKeys as WalletTK } from 'actions/wallet';
import { AppState } from 'reducers';
import { showNotification } from 'actions/notifications';
import { tokenExists } from 'selectors/config';
import { isEtherUnit } from 'libs/units';
import { showLiteSend } from 'actions/swap';
import { TypeKeys as SwapTK } from 'actions/swap/constants';

type SwapState = AppState['swap'];

function* configureLiteSend(): SagaIterator {
  try {
    const { amount, id }: SwapState['origin'] = yield select(getOrigin);
    const paymentAddress: SwapState['paymentAddress'] = yield call(fetchPaymentAddress);
    if (!paymentAddress) {
      return yield put(showLiteSend(false));
    }
    const supportedUnit: boolean = yield call(isSupportedUnit, id);
    if (!supportedUnit) {
      return yield put(showLiteSend(false));
    }

    yield put(setCurrentValue(amount.toString()));
    yield put(setCurrentTo(paymentAddress));
    yield put(setUnitMeta(id));

    return yield put(showLiteSend(true));
  } finally {
    if (yield cancelled()) {
      yield put(showLiteSend(false));

      console.log('Saga cancelled');
    }
  }
}

function* handleConfigureLiteSend(): SagaIterator {
  while (true) {
    const result = yield race({
      liteSend: call(configureLiteSend),
      newWallet: take(WalletTK.WALLET_SET),
      resetWallet: take(WalletTK.WALLET_RESET)
    });

    // if wallet reset is called, that means the user navigated away from the page, so we cancel everything
    if (result.resetWallet) {
      return;
    }
    // if liteSend finished, then we are done here
    if (result.liteSend) {
      return;
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

export const liteSend = takeEvery(SwapTK.SWAP_CONFIGURE_LITE_SEND, handleConfigureLiteSend);
