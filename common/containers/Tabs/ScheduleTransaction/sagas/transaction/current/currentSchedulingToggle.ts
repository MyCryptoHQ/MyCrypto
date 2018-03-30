import { setGasLimitField } from 'actions/transaction/actionCreators/fields';
import { call, put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/transaction/constants';
import { SetGasLimitFieldAction, SetSchedulingToggleAction } from 'actions/transaction';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import BN from 'bn.js';

export function* setGasLimitForScheduling({
  payload: { value: useScheduling }
}: SetSchedulingToggleAction): SagaIterator {
  const gasLimit = useScheduling ? EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT : new BN('21000');

  yield call(setGasLimit, {
    raw: gasLimit.toString(),
    value: gasLimit
  });
}

export function* setGasLimit(payload: SetGasLimitFieldAction['payload']) {
  yield put(setGasLimitField(payload));
}

export const currentSchedulingToggle = takeLatest(
  [TypeKeys.SCHEDULING_TOGGLE_SET],
  setGasLimitForScheduling
);
