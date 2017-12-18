import { SagaIterator } from 'redux-saga';
import { apply, put, select, takeEvery } from 'redux-saga/effects';
import {
  sendEverythingFailed,
  TypeKeys as TK,
  setValueField,
  setTokenValue,
  sendEverythingSucceeded
} from 'actions/transaction';
import { showNotification } from 'actions/notifications';
import {
  isEtherTransaction,
  getTransaction,
  IGetTransaction,
  getDecimal
} from 'selectors/transaction';
import { getEtherBalance, getCurrentBalance } from 'selectors/wallet';

import { AppState } from 'reducers';
import { fromTokenBase, fromWei, Wei, TokenValue } from 'libs/units';

export function* handleSendEverything(): SagaIterator {
  const { transaction }: IGetTransaction = yield select(getTransaction);
  const currentBalance: Wei | TokenValue | null = yield select(getCurrentBalance);
  const etherBalance: AppState['wallet']['balance']['wei'] = yield select(getEtherBalance);
  if (!etherBalance || !currentBalance) {
    return yield put(sendEverythingFailed());
  }
  transaction.value = Buffer.from([]);

  const etherTransaction: boolean = yield select(isEtherTransaction);
  const setter = etherTransaction ? setValueField : setTokenValue;

  // set transaction value to 0 so it's not calculated in the upfrontcost

  const totalCost: Wei = yield apply(transaction, transaction.getUpfrontCost);
  if (totalCost.gt(etherBalance)) {
    // Dust amount is too small
    yield put(
      showNotification(
        'warning',
        `The cost of gas is higher than your balance:
    Total cost: ${totalCost} > 
    Your Ether balance: ${etherBalance}`
      )
    );
    yield put(sendEverythingFailed());

    return yield put(setter({ raw: '0', value: null }));
  }
  if (etherTransaction) {
    const remainder = currentBalance.sub(totalCost);
    const rawVersion = fromWei(remainder, 'ether');
    yield put(setter({ raw: rawVersion, value: remainder }));

    yield put(sendEverythingSucceeded());
  } else {
    // else we just max out the token value
    const decimal: number = yield select(getDecimal);
    const rawVersion = fromTokenBase(currentBalance, decimal);
    yield put(setter({ raw: rawVersion, value: currentBalance }));

    yield put(sendEverythingSucceeded());
  }
}

export const sendEverything = [takeEvery(TK.SEND_EVERYTHING_REQUESTED, handleSendEverything)];
