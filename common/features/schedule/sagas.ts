import { SagaIterator, delay } from 'redux-saga';
import { select, take, call, apply, fork, put, all, takeLatest } from 'redux-saga/effects';
import BN from 'bn.js';

import { toTokenBase, Wei } from 'libs/units';
import { EAC_SCHEDULING_CONFIG, parseSchedulingParametersValidity } from 'libs/scheduling';
import RequestFactory from 'libs/scheduling/contracts/RequestFactory';
import { validDecimal, validNumber } from 'libs/validators';
import * as configMetaSelectors from 'features/config/meta/selectors';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import * as transactionFieldsTypes from 'features/transaction/fields/types';
import * as transactionFieldsActions from 'features/transaction/fields/actions';
import * as transactionMetaSelectors from 'features/transaction/meta/selectors';
import * as transactionSelectors from 'features/transaction/selectors';
import * as transactionHelpers from 'features/transaction/helpers';
import * as scheduleTypes from './types';
import * as scheduleActions from './actions';
import * as scheduleSelectors from './selectors';

//#region Schedule Timestamp
export function* setCurrentScheduleTimestampSaga({
  payload: raw
}: scheduleTypes.SetCurrentScheduleTimestampAction): SagaIterator {
  let value: Date | null = null;

  value = new Date(raw);

  yield put(scheduleActions.setScheduleTimestampField({ value, raw }));
}

export const currentScheduleTimestamp = takeLatest(
  [scheduleTypes.ScheduleActions.CURRENT_SCHEDULE_TIMESTAMP_SET],
  setCurrentScheduleTimestampSaga
);
//#endregion Schedule Timestamp

//#region Schedule Timezone
export function* setCurrentScheduleTimezoneSaga({
  payload: raw
}: scheduleTypes.SetCurrentScheduleTimezoneAction): SagaIterator {
  const value = raw;

  yield put(scheduleActions.setScheduleTimezone({ value, raw }));
}

export const currentScheduleTimezone = takeLatest(
  [scheduleTypes.ScheduleActions.CURRENT_SCHEDULE_TIMEZONE_SET],
  setCurrentScheduleTimezoneSaga
);
//#endregion Schedule Timezone

//#region Scheduling Toggle
export function* setGasLimitForSchedulingSaga({
  payload: { value: useScheduling }
}: scheduleTypes.SetSchedulingToggleAction): SagaIterator {
  const gasLimit = useScheduling
    ? EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT
    : EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK;

  yield put(
    transactionFieldsActions.setGasLimitField({
      raw: gasLimit.toString(),
      value: gasLimit
    })
  );
}

export const currentSchedulingToggle = takeLatest(
  [scheduleTypes.ScheduleActions.TOGGLE_SET],
  setGasLimitForSchedulingSaga
);
//#endregion Scheduling Toggle

//#region Time Bounty
export function* setCurrentTimeBountySaga({
  payload: raw
}: scheduleTypes.SetCurrentTimeBountyAction): SagaIterator {
  const decimal: number = yield select(transactionMetaSelectors.getDecimal);
  const unit: string = yield select(transactionSelectors.getUnit);

  if (!validNumber(parseInt(raw, 10)) || !validDecimal(raw, decimal)) {
    yield put(scheduleActions.setTimeBountyField({ raw, value: null }));
  }

  const value = toTokenBase(raw, decimal);
  const isInputValid: boolean = yield call(transactionHelpers.validateInput, value, unit);

  const isValid = isInputValid && value.gte(Wei('0'));

  yield put(scheduleActions.setTimeBountyField({ raw, value: isValid ? value : null }));
}

export const currentTimeBounty = takeLatest(
  [scheduleTypes.ScheduleActions.CURRENT_TIME_BOUNTY_SET],
  setCurrentTimeBountySaga
);
//#endregion Time Bounty

//#region Window Size
export function* setCurrentWindowSizeSaga({
  payload: raw
}: scheduleTypes.SetCurrentWindowSizeAction): SagaIterator {
  let value: BN | null = null;

  if (!validNumber(parseInt(raw, 10))) {
    yield put(scheduleActions.setWindowSizeField({ raw, value: null }));
  }

  value = new BN(raw);

  yield put(scheduleActions.setWindowSizeField({ value, raw }));
}

export const currentWindowSize = takeLatest(
  [scheduleTypes.ScheduleActions.CURRENT_WINDOW_SIZE_SET],
  setCurrentWindowSizeSaga
);
//#endregion Window Size

//#region Window Start
export function* setCurrentWindowStartSaga({
  payload: raw
}: scheduleTypes.SetCurrentWindowStartAction): SagaIterator {
  let value: number | null = null;

  value = parseInt(raw, 10);

  yield put(scheduleActions.setWindowStartField({ value, raw }));
}

export const currentWindowStart = takeLatest(
  [scheduleTypes.ScheduleActions.CURRENT_WINDOW_START_SET],
  setCurrentWindowStartSaga
);
//#endregion Window Start

//#region Params Validity
export function* shouldValidateParams(): SagaIterator {
  while (true) {
    yield take([
      transactionFieldsTypes.TRANSACTION_FIELDS.TO_FIELD_SET,
      transactionFieldsTypes.TRANSACTION_FIELDS.DATA_FIELD_SET,
      transactionFieldsTypes.TRANSACTION_FIELDS.VALUE_FIELD_SET,
      scheduleTypes.ScheduleActions.CURRENT_TIME_BOUNTY_SET,
      scheduleTypes.ScheduleActions.WINDOW_SIZE_FIELD_SET,
      scheduleTypes.ScheduleActions.WINDOW_START_FIELD_SET,
      scheduleTypes.ScheduleActions.TIMESTAMP_FIELD_SET,
      scheduleTypes.ScheduleActions.TIME_BOUNTY_FIELD_SET,
      scheduleTypes.ScheduleActions.TYPE_SET,
      scheduleTypes.ScheduleActions.TOGGLE_SET,
      scheduleTypes.ScheduleActions.TIMEZONE_SET
    ]);

    yield call(delay, 250);

    const isOffline: boolean = yield select(configMetaSelectors.getOffline);
    const scheduling: boolean = yield select(scheduleSelectors.isSchedulingEnabled);

    if (isOffline || !scheduling) {
      continue;
    }

    yield call(checkSchedulingParametersValidity);
  }
}

function* checkSchedulingParametersValidity() {
  const validateParamsCallData: scheduleSelectors.IGetValidateScheduleParamsCallPayload = yield select(
    scheduleSelectors.getValidateScheduleParamsCallPayload
  );

  if (!validateParamsCallData) {
    return yield put(
      scheduleActions.setScheduleParamsValidity({
        value: false
      })
    );
  }

  const node = yield select(configNodesSelectors.getNodeLib);

  const callResult: string = yield apply(node, node.sendCallRequest, [validateParamsCallData]);

  const { paramsValidity } = RequestFactory.validateRequestParams.decodeOutput(callResult);

  const errors = parseSchedulingParametersValidity(paramsValidity);

  yield put(
    scheduleActions.setScheduleParamsValidity({
      value: errors.length === 0
    })
  );
}

export const schedulingParamsValidity = fork(shouldValidateParams);
//#endregion Params Validity

export function* scheduleSaga(): SagaIterator {
  yield all([
    currentWindowSize,
    currentWindowStart,
    currentScheduleTimestamp,
    currentTimeBounty,
    currentSchedulingToggle,
    currentScheduleTimezone,
    schedulingParamsValidity
  ]);
}
