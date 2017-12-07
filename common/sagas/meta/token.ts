import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import {
  SetTokenToMetaAction,
  setDataField,
  SetTokenValueMetaAction,
  TypeKeys
} from 'actions/transaction';
import { encodeTransfer } from 'libs/transaction/utils/token';
import { getTokenValue } from 'selectors/transaction/meta';
import { AppState } from 'reducers';
import { bufferToHex } from 'ethereumjs-util';
import { getTokenTo } from 'selectors/transaction';

function* handleTokenTo({ payload }: SetTokenToMetaAction): SagaIterator {
  const tokenValue: AppState['transaction']['meta']['tokenValue'] = yield select(getTokenValue);
  if (!(tokenValue.value && payload.value)) {
    return;
  }

  // encode token data and dispatch it
  const data = yield call(encodeTransfer, payload.value, tokenValue.value);
  yield put(setDataField({ raw: bufferToHex(data), value: data }));
}

function* handleTokenValue({ payload }: SetTokenValueMetaAction) {
  const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(getTokenTo);
  if (!(tokenTo.value && payload.value)) {
    return;
  }
  const data = yield call(encodeTransfer, tokenTo.value, payload.value);
  yield put(setDataField({ raw: bufferToHex(data), value: data }));
}

export function* handleToken(): SagaIterator {
  yield [
    takeEvery(TypeKeys.TOKEN_TO_META_SET, handleTokenTo),
    takeEvery(TypeKeys.TOKEN_VALUE_META_SET, handleTokenValue)
  ];
}
