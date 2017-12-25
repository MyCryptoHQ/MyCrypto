import { SagaIterator, delay } from 'redux-saga';
import { select, put, call, take, fork, race, cancelled } from 'redux-saga/effects';
import { getOrigin, getPaymentAddress } from 'selectors/swap';
import { setUnitMeta, setCurrentTo, setCurrentValue } from 'actions/transaction';
import { TypeKeys, SetWalletAction } from 'actions/wallet';
import { AppState } from 'reducers';
import { showNotification } from 'actions/notifications';
import { tokenExists } from 'selectors/config';
import { isEtherUnit } from 'libs/units';

type SwapState = AppState['swap'];
function* configureLiteSend(): SagaIterator {
  try {
    const { amount, id }: SwapState['origin'] = yield select(getOrigin);
    const paymentAddress: SwapState['paymentAddress'] = yield call(fetchPaymentAddress);
    if (!paymentAddress) {
      return;
    }
    const supportedUnit: boolean = yield call(isSupportedUnit, id);
    if (!supportedUnit) {
      return;
    }

    yield put(setCurrentValue(amount.toString()));
    yield put(setCurrentTo(paymentAddress));
    yield put(setUnitMeta(id));
  } finally {
    if (yield cancelled()) {
    }
  }
}
function* handleConfigureLiteSend(): SagaIterator {
  while (true) {
    const result = yield race({
      liteSend: call(configureLiteSend),
      newWallet: call(watchForNewWallet)
    });
    if (!result.newWallet) {
      return;
    }
  }
}

function* watchForNewWallet(): SagaIterator {
  const action: SetWalletAction = yield take(TypeKeys.WALLET_SET);
  return action.type;
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
