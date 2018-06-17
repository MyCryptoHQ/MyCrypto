import { SagaIterator, delay } from 'redux-saga';
import { select, take, call, apply, fork, put, all, takeLatest } from 'redux-saga/effects';
import BN from 'bn.js';

import { toTokenBase, Wei } from 'libs/units';
import { EAC_SCHEDULING_CONFIG, parseSchedulingParametersValidity } from 'libs/scheduling';
import RequestFactory from 'libs/scheduling/contracts/RequestFactory';
import { validDecimal, validNumber } from 'libs/validators';
import * as derivedSelectors from 'features/selectors';
import * as configMetaSelectors from 'features/config/meta/selectors';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import {
  transactionFieldsTypes,
  transactionFieldsActions,
  transactionMetaSelectors,
  transactionHelpers
} from 'features/transaction';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';

//#region Schedule Timestamp
export function* setCurrentScheduleTimestampSaga({
  payload: raw
}: types.SetCurrentScheduleTimestampAction): SagaIterator {
  let value: Date | null = null;

  value = new Date(raw);

  yield put(actions.setScheduleTimestampField({ value, raw }));
}

export const currentScheduleTimestamp = takeLatest(
  [types.ScheduleActions.CURRENT_SCHEDULE_TIMESTAMP_SET],
  setCurrentScheduleTimestampSaga
);
//#endregion Schedule Timestamp

//#region Schedule Timezone
export function* setCurrentScheduleTimezoneSaga({
  payload: raw
}: types.SetCurrentScheduleTimezoneAction): SagaIterator {
  const value = raw;

  yield put(actions.setScheduleTimezone({ value, raw }));
}

export const currentScheduleTimezone = takeLatest(
  [types.ScheduleActions.CURRENT_SCHEDULE_TIMEZONE_SET],
  setCurrentScheduleTimezoneSaga
);
//#endregion Schedule Timezone

//#region Scheduling Toggle
export function* setGasLimitForSchedulingSaga({
  payload: { value: useScheduling }
}: types.SetSchedulingToggleAction): SagaIterator {
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
  [types.ScheduleActions.TOGGLE_SET],
  setGasLimitForSchedulingSaga
);
//#endregion Scheduling Toggle

//#region Time Bounty
export function* setCurrentTimeBountySaga({
  payload: raw
}: types.SetCurrentTimeBountyAction): SagaIterator {
  const decimal: number = yield select(transactionMetaSelectors.getDecimal);
  const unit: string = yield select(derivedSelectors.getUnit);

  if (!validNumber(parseInt(raw, 10)) || !validDecimal(raw, decimal)) {
    yield put(actions.setTimeBountyField({ raw, value: null }));
  }

  const value = toTokenBase(raw, decimal);
  const isInputValid: boolean = yield call(transactionHelpers.validateInput, value, unit);

  const isValid = isInputValid && value.gte(Wei('0'));

  yield put(actions.setTimeBountyField({ raw, value: isValid ? value : null }));
}

export const currentTimeBounty = takeLatest(
  [types.ScheduleActions.CURRENT_TIME_BOUNTY_SET],
  setCurrentTimeBountySaga
);
//#endregion Time Bounty

//#region Window Size
export function* setCurrentWindowSizeSaga({
  payload: raw
}: types.SetCurrentWindowSizeAction): SagaIterator {
  let value: BN | null = null;

  if (!validNumber(parseInt(raw, 10))) {
    yield put(actions.setWindowSizeField({ raw, value: null }));
  }

  value = new BN(raw);

  yield put(actions.setWindowSizeField({ value, raw }));
}

export const currentWindowSize = takeLatest(
  [types.ScheduleActions.CURRENT_WINDOW_SIZE_SET],
  setCurrentWindowSizeSaga
);
//#endregion Window Size

//#region Window Start
export function* setCurrentWindowStartSaga({
  payload: raw
}: types.SetCurrentWindowStartAction): SagaIterator {
  let value: number | null = null;

  value = parseInt(raw, 10);

  yield put(actions.setWindowStartField({ value, raw }));
}

export const currentWindowStart = takeLatest(
  [types.ScheduleActions.CURRENT_WINDOW_START_SET],
  setCurrentWindowStartSaga
);
//#endregion Window Start

//#region Params Validity
export function* shouldValidateParams(): SagaIterator {
  while (true) {
    yield take([
      transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET,
      transactionFieldsTypes.TransactionFieldsActions.DATA_FIELD_SET,
      transactionFieldsTypes.TransactionFieldsActions.VALUE_FIELD_SET,
      types.ScheduleActions.CURRENT_TIME_BOUNTY_SET,
      types.ScheduleActions.WINDOW_SIZE_FIELD_SET,
      types.ScheduleActions.WINDOW_START_FIELD_SET,
      types.ScheduleActions.TIMESTAMP_FIELD_SET,
      types.ScheduleActions.TIME_BOUNTY_FIELD_SET,
      types.ScheduleActions.TYPE_SET,
      types.ScheduleActions.TOGGLE_SET,
      types.ScheduleActions.TIMEZONE_SET
    ]);

    yield call(delay, 250);

    const isOffline: boolean = yield select(configMetaSelectors.getOffline);
    const scheduling: boolean = yield select(selectors.isSchedulingEnabled);

    if (isOffline || !scheduling) {
      continue;
    }

    yield call(checkSchedulingParametersValidity);
  }
}

function* checkSchedulingParametersValidity() {
  const validateParamsCallData: derivedSelectors.IGetValidateScheduleParamsCallPayload = yield select(
    derivedSelectors.getValidateScheduleParamsCallPayload
  );

  if (!validateParamsCallData) {
    return yield put(
      actions.setScheduleParamsValidity({
        value: false
      })
    );
  }

  const node = yield select(configNodesSelectors.getNodeLib);

  const callResult: string = yield apply(node, node.sendCallRequest, [validateParamsCallData]);

  const { paramsValidity } = RequestFactory.validateRequestParams.decodeOutput(callResult);

  const errors = parseSchedulingParametersValidity(paramsValidity);

  yield put(
    actions.setScheduleParamsValidity({
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
