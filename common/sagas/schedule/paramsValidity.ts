import { SagaIterator, delay } from 'redux-saga';
import { select, fork, call, take, apply, put } from 'redux-saga/effects';
import { getOffline, getNodeLib } from 'selectors/config';
import {
  ICurrentSchedulingToggle,
  ICurrentWindowSize,
  ICurrentWindowStart,
  ICurrentScheduleType,
  ICurrentScheduleTimezone,
  ICurrentScheduleTimestamp,
  ICurrentTimeBounty,
  getSchedulingToggle,
  getScheduleTimestamp,
  getScheduleTimezone,
  getScheduleType,
  getWindowStart,
  getWindowSize,
  getTimeBounty,
  getScheduleGasPrice,
  getScheduleGasLimit,
  getScheduleDeposit
} from 'selectors/schedule/fields';
import {
  TypeKeys,
  SetScheduleParamsValidityAction,
  setScheduleParamsValidity
} from 'actions/schedule';
import { TypeKeys as TransactionTypeKeys } from 'actions/transaction';
import { getData } from 'selectors/transaction/fields';
import { getWalletInst } from 'selectors/wallet';
import {
  EAC_SCHEDULING_CONFIG,
  calcEACEndowment,
  getValidateRequestParamsData,
  EAC_ADDRESSES,
  parseSchedulingParametersValidity
} from 'libs/scheduling';
import { gasPriceToBase, Wei } from 'libs/units';
import { bufferToHex } from 'ethereumjs-util';
import RequestFactory from 'libs/scheduling/contracts/RequestFactory';
import { windowSizeBlockToMin, calculateWindowStart } from 'selectors/schedule/helpers';
import { getCurrentTo, getCurrentValue } from 'selectors/transaction/current';

export function* shouldValidateParams(): SagaIterator {
  while (true) {
    yield take([
      TransactionTypeKeys.TO_FIELD_SET,
      TransactionTypeKeys.DATA_FIELD_SET,
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
    const schedulingToggle: ICurrentSchedulingToggle = yield select(getSchedulingToggle);
    const scheduling = Boolean(schedulingToggle && schedulingToggle.value);

    if (isOffline || !scheduling) {
      continue;
    }

    yield call(checkSchedulingParametersValidity);
  }
}

function* checkSchedulingParametersValidity() {
  const currentTo = yield select(getCurrentTo);
  const currentValue = yield select(getCurrentValue);
  const callData = yield select(getData);
  const scheduleType: ICurrentScheduleType = yield select(getScheduleType);
  const windowStart: ICurrentWindowStart = yield select(getWindowStart);
  const windowSize: ICurrentWindowSize = yield select(getWindowSize);
  const timeBounty: ICurrentTimeBounty = yield select(getTimeBounty);
  const scheduleGasPrice = yield select(getScheduleGasPrice);
  const scheduleGasLimit = yield select(getScheduleGasLimit);
  const deposit = yield select(getScheduleDeposit);
  const node = yield select(getNodeLib);
  const wallet = yield select(getWalletInst);
  const scheduleTimestamp: ICurrentScheduleTimestamp = yield select(getScheduleTimestamp);
  const scheduleTimezone: ICurrentScheduleTimezone = yield select(getScheduleTimezone);

  if (
    !currentValue.value ||
    !currentTo.value ||
    !scheduleGasPrice.value ||
    !wallet ||
    !windowSize.value ||
    !(windowStart.value || scheduleTimestamp.value)
  ) {
    return;
  }

  const callGasLimit = scheduleGasLimit.value || EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK;

  const endowment = calcEACEndowment(
    callGasLimit,
    currentValue.value || Wei('0'),
    scheduleGasPrice.value || gasPriceToBase(EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_PRICE_FALLBACK),
    timeBounty.value
  );

  const fromAddress = yield apply(wallet, wallet.getAddressString);

  const data = getValidateRequestParamsData(
    bufferToHex(currentTo.value),
    callData.value ? bufferToHex(callData.value) : '',
    callGasLimit,
    currentValue.value,
    windowSizeBlockToMin(windowSize.value, scheduleType.value),
    calculateWindowStart(
      scheduleType.value,
      scheduleTimestamp,
      scheduleTimezone.value,
      windowStart.value
    ),
    scheduleGasPrice.value,
    timeBounty.value,
    deposit.value || Wei('0'),
    scheduleType.value === 'time',
    endowment,
    fromAddress
  );

  const callResult: string = yield apply(node, node.sendCallRequest, [
    {
      to: EAC_ADDRESSES.KOVAN.requestFactory,
      data
    }
  ]);

  const { paramsValidity } = RequestFactory.validateRequestParams.decodeOutput(callResult);

  const errors = parseSchedulingParametersValidity(paramsValidity);
  const paramsValid = errors.length === 0;

  yield call(setField, {
    raw: paramsValid,
    value: paramsValid
  });
}

export function* setField(payload: SetScheduleParamsValidityAction['payload']) {
  yield put(setScheduleParamsValidity(payload));
}

export const schedulingParamsValidity = fork(shouldValidateParams);
