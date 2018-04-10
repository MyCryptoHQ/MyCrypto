import { setGasLimitField } from 'actions/transaction/actionCreators/fields';
import { put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/schedule/constants';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import { SetSchedulingToggleAction } from 'actions/schedule/actionTypes';

export function* setGasLimitForScheduling({
  payload: { value: useScheduling }
}: SetSchedulingToggleAction): SagaIterator {
  const gasLimit = useScheduling
    ? EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT
    : EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK;

  yield put(
    setGasLimitField({
      raw: gasLimit.toString(),
      value: gasLimit
    })
  );
}

export const currentSchedulingToggle = takeLatest(
  [TypeKeys.SCHEDULING_TOGGLE_SET],
  setGasLimitForScheduling
);
