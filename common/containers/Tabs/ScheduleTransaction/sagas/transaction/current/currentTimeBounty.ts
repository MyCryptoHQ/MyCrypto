import { setTimeBountyField } from 'actions/transaction/actionCreators/fields';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/transaction/constants';
import { SetTimeBountyFieldAction } from 'actions/transaction';
import { getDecimal, getUnit } from 'selectors/transaction';
import { validDecimal, validNumber } from 'libs/validators';
import { toTokenBase } from 'libs/units';
import { validateInput } from 'sagas/transaction/validationHelpers';
import BN from 'bn.js';
import { SetCurrentTimeBountyAction } from '../../../actions/transaction/actionTypes/timeBounty';

export function* setCurrentTimeBounty({ payload: raw }: SetCurrentTimeBountyAction): SagaIterator {
  const decimal: number = yield select(getDecimal);
  const unit: string = yield select(getUnit);

  if (!validNumber(parseInt(raw, 10)) || !validDecimal(raw, decimal)) {
    yield call(setField, { raw, value: null });
  }

  const value = toTokenBase(raw, decimal);
  const isInputValid: boolean = yield call(validateInput, value, unit);

  const isValid = isInputValid && value.gte(new BN(0));

  yield call(setField, { raw, value: isValid ? value : null });
}

export function* setField(payload: SetTimeBountyFieldAction['payload']) {
  yield put(setTimeBountyField(payload));
}

export const currentTimeBounty = takeLatest(
  [TypeKeys.CURRENT_TIME_BOUNTY_SET],
  setCurrentTimeBounty
);
