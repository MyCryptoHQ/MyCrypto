import { call, put, takeLatest, select } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/schedule/constants';
import { getDecimal, getUnit } from 'selectors/transaction';
import { validDecimal, validNumber } from 'libs/validators';
import { toTokenBase, Wei } from 'libs/units';
import { validateInput } from 'sagas/transaction/validationHelpers';
import { SetCurrentTimeBountyAction } from 'actions/schedule/actionTypes/timeBounty';
import { setTimeBountyField } from 'actions/schedule';

export function* setCurrentTimeBounty({ payload: raw }: SetCurrentTimeBountyAction): SagaIterator {
  const decimal: number = yield select(getDecimal);
  const unit: string = yield select(getUnit);

  if (!validNumber(parseInt(raw, 10)) || !validDecimal(raw, decimal)) {
    yield put(setTimeBountyField({ raw, value: null }));
  }

  const value = toTokenBase(raw, decimal);
  const isInputValid: boolean = yield call(validateInput, value, unit);

  const isValid = isInputValid && value.gte(Wei('0'));

  yield put(setTimeBountyField({ raw, value: isValid ? value : null }));
}

export const currentTimeBounty = takeLatest(
  [TypeKeys.CURRENT_TIME_BOUNTY_SET],
  setCurrentTimeBounty
);
