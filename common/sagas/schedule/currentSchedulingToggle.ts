import { setGasLimitField } from 'actions/transaction/actionCreators/fields';
import { call, put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/schedule/constants';
import { SetGasLimitFieldAction } from 'actions/transaction';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import { SetSchedulingToggleAction } from 'actions/schedule/actionTypes';
import { Wei } from 'libs/units';

export function* setGasLimitForScheduling({
  payload: { value: useScheduling }
}: SetSchedulingToggleAction): SagaIterator {
  const gasLimit = useScheduling ? EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT : Wei('21000');

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
