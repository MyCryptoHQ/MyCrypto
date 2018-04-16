import { SagaIterator, delay } from 'redux-saga';
import { select, fork, call, take, apply, put } from 'redux-saga/effects';
import { getOffline, getNodeLib } from 'selectors/config';
import { isSchedulingEnabled } from 'selectors/schedule/fields';
import { TypeKeys, setScheduleParamsValidity } from 'actions/schedule';
import { TypeKeys as TransactionTypeKeys } from 'actions/transaction';
import { parseSchedulingParametersValidity } from 'libs/scheduling';
import RequestFactory from 'libs/scheduling/contracts/RequestFactory';
import {
  getValidateScheduleParamsCallPayload,
  IGetValidateScheduleParamsCallPayload
} from 'selectors/schedule/transaction';

export function* shouldValidateParams(): SagaIterator {
  while (true) {
    yield take([
      TransactionTypeKeys.TO_FIELD_SET,
      TransactionTypeKeys.DATA_FIELD_SET,
      TransactionTypeKeys.VALUE_FIELD_SET,
      TypeKeys.CURRENT_TIME_BOUNTY_SET,
      TypeKeys.WINDOW_SIZE_FIELD_SET,
      TypeKeys.WINDOW_START_FIELD_SET,
      TypeKeys.SCHEDULE_TIMESTAMP_FIELD_SET,
      TypeKeys.TIME_BOUNTY_FIELD_SET,
      TypeKeys.SCHEDULE_TYPE_SET,
      TypeKeys.SCHEDULING_TOGGLE_SET,
      TypeKeys.SCHEDULE_TIMEZONE_SET
    ]);

    yield call(delay, 250);

    const isOffline: boolean = yield select(getOffline);
    const scheduling: boolean = yield select(isSchedulingEnabled);

    if (isOffline || !scheduling) {
      continue;
    }

    yield call(checkSchedulingParametersValidity);
  }
}

function* checkSchedulingParametersValidity() {
  const validateParamsCallData: IGetValidateScheduleParamsCallPayload = yield select(
    getValidateScheduleParamsCallPayload
  );

  if (!validateParamsCallData) {
    return yield put(
      setScheduleParamsValidity({
        value: false
      })
    );
  }

  const node = yield select(getNodeLib);

  const callResult: string = yield apply(node, node.sendCallRequest, [validateParamsCallData]);

  const { paramsValidity } = RequestFactory.validateRequestParams.decodeOutput(callResult);

  const errors = parseSchedulingParametersValidity(paramsValidity);

  yield put(
    setScheduleParamsValidity({
      value: errors.length === 0
    })
  );
}

export const schedulingParamsValidity = fork(shouldValidateParams);
