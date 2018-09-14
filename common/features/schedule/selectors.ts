import BN from 'bn.js';

import { Wei } from 'libs/units';
import {
  gasPriceValidator,
  gasLimitValidator,
  timeBountyValidator,
  isValidNumberOrDecimal
} from 'libs/validators';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import { AppState } from 'features/reducers';
import * as helpers from './helpers';

//#region Fields
export const getScheduleState = (state: AppState) => state.schedule;
export const getTimeBounty = (state: AppState) => getScheduleState(state).timeBounty;
export const getWindowSize = (state: AppState) => getScheduleState(state).windowSize;
export const getWindowStart = (state: AppState) => getScheduleState(state).windowStart;
export const getScheduleTimestamp = (state: AppState) => getScheduleState(state).scheduleTimestamp;
export const getScheduleType = (state: AppState) => getScheduleState(state).scheduleType;
export const getScheduleTimezone = (state: AppState) => getScheduleState(state).scheduleTimezone;
export const getSchedulingToggle = (state: AppState) => getScheduleState(state).schedulingToggle;
export const getScheduleGasLimit = (state: AppState) => getScheduleState(state).scheduleGasLimit;
export const getScheduleGasPrice = (state: AppState) => getScheduleState(state).scheduleGasPrice;
export const getScheduleDeposit = (state: AppState) => getScheduleState(state).scheduleDeposit;
export const getScheduleParamsValidity = (state: AppState) =>
  getScheduleState(state).scheduleParamsValidity;

export const isValidScheduleGasPrice = (state: AppState): boolean =>
  gasPriceValidator(getScheduleGasPrice(state).raw);

export const isValidScheduleGasLimit = (state: AppState): boolean =>
  gasLimitValidator(getScheduleGasLimit(state).raw);

export const isValidScheduleDeposit = (state: AppState): boolean => {
  const depositValue = getScheduleDeposit(state).value;

  return Boolean(depositValue && depositValue.gte(new BN('0')) && depositValue.bitLength() <= 256);
};

export const isSchedulingEnabled = (state: AppState): boolean => {
  const schedulingToggle = getSchedulingToggle(state);

  return schedulingToggle && schedulingToggle.value;
};
//#endregion Fields

//#region Current

//#region Schedule Timestamp
export const isValidCurrentScheduleTimestamp = (state: AppState) => {
  const currentScheduleTimestamp = getScheduleTimestamp(state);
  const currentScheduleTimezone = getScheduleTimezone(state);

  const currentScheduleDatetime = helpers.dateTimeToTimezone(
    currentScheduleTimestamp,
    currentScheduleTimezone.value
  );

  return (
    currentScheduleDatetime >=
    helpers.minFromNow(EAC_SCHEDULING_CONFIG.ALLOW_SCHEDULING_MIN_AFTER_NOW)
  );
};

export const getCurrentScheduleTimestamp = (state: AppState): helpers.ICurrentScheduleTimestamp =>
  getScheduleTimestamp(state);
//#endregion Schedule Timestamp

//#region Schedule Timezone
export interface ICurrentScheduleTimezone {
  raw: string;
  value: string;
}

export const getCurrentScheduleTimezone = (state: AppState): ICurrentScheduleTimezone =>
  getScheduleTimezone(state);
//#endregion Schedule Timezone

//#region Schedule Type
export interface ICurrentScheduleType {
  raw: string;
  value: string | null;
}

export const getCurrentScheduleType = (state: AppState): ICurrentScheduleType =>
  getScheduleType(state);
//#endregion Schedule Type

//#region Scheduling Toggle
export interface ICurrentSchedulingToggle {
  value: boolean;
}

export const getCurrentSchedulingToggle = (state: AppState): ICurrentSchedulingToggle =>
  getSchedulingToggle(state);
//#endregion Scheduling Toggle

//#region Time Bounty
export interface ICurrentTimeBounty {
  raw: string;
  value: Wei | null;
}

export const isValidCurrentTimeBounty = (state: AppState) => {
  const currentTimeBounty = getTimeBounty(state);

  return timeBountyValidator(currentTimeBounty.value);
};

export const getCurrentTimeBounty = (state: AppState): ICurrentTimeBounty => getTimeBounty(state);
//#endregion Time Bounty

//#region Window Size
export interface ICurrentWindowSize {
  raw: string;
  value: BN | null;
}

export const isValidCurrentWindowSize = (state: AppState) => {
  const currentWindowSize = getWindowSize(state);

  return (
    currentWindowSize &&
    currentWindowSize.raw &&
    isValidNumberOrDecimal(currentWindowSize.raw) &&
    currentWindowSize.value &&
    currentWindowSize.value.gt(new BN(0)) &&
    currentWindowSize.value.bitLength() <= 256
  );
};

export const getCurrentWindowSize = (state: AppState): ICurrentWindowSize => getWindowSize(state);

export const isWindowSizeValid = (state: AppState): boolean => {
  const windowSize = getWindowSize(state);

  return Boolean(windowSize && windowSize.value && windowSize.value.bitLength() <= 256);
};
//#endregion Window Size

//#region Window Start
export interface ICurrentWindowStart {
  raw: string;
  value: number | null;
}

export const getCurrentWindowStart = (state: AppState): ICurrentWindowStart =>
  getWindowStart(state);
//#endregion Window Start

//#endregion Current
