import { AppState } from 'reducers';
import { gasPriceValidator, gasLimitValidator } from 'libs/validators';
import BN from 'bn.js';

const getScheduleState = (state: AppState) => state.schedule;

const getTimeBounty = (state: AppState) => getScheduleState(state).timeBounty;
const getWindowSize = (state: AppState) => getScheduleState(state).windowSize;
const getWindowStart = (state: AppState) => getScheduleState(state).windowStart;
const getScheduleTimestamp = (state: AppState) => getScheduleState(state).scheduleTimestamp;
const getScheduleType = (state: AppState) => getScheduleState(state).scheduleType;
const getScheduleTimezone = (state: AppState) => getScheduleState(state).scheduleTimezone;
const getSchedulingToggle = (state: AppState) => getScheduleState(state).schedulingToggle;
const getScheduleGasLimit = (state: AppState) => getScheduleState(state).scheduleGasLimit;
const getScheduleGasPrice = (state: AppState) => getScheduleState(state).scheduleGasPrice;
const getScheduleDeposit = (state: AppState) => getScheduleState(state).scheduleDeposit;
const getScheduleParamsValidity = (state: AppState) =>
  getScheduleState(state).scheduleParamsValidity;

const isValidScheduleGasPrice = (state: AppState): boolean =>
  gasPriceValidator(getScheduleGasPrice(state).raw);

const isValidScheduleGasLimit = (state: AppState): boolean =>
  gasLimitValidator(getScheduleGasLimit(state).raw);

const isValidScheduleDeposit = (state: AppState): boolean => {
  const depositValue = getScheduleDeposit(state).value;

  if (!depositValue) {
    return true;
  }

  return depositValue.gte(new BN('0')) && depositValue.bitLength() <= 256;
};

const isSchedulingEnabled = (state: AppState): boolean => {
  const schedulingToggle = getSchedulingToggle(state);

  return schedulingToggle && schedulingToggle.value;
};

export {
  getScheduleState,
  getTimeBounty,
  getWindowSize,
  getWindowStart,
  getScheduleTimestamp,
  getScheduleType,
  getScheduleTimezone,
  getSchedulingToggle,
  getScheduleGasLimit,
  getScheduleGasPrice,
  getScheduleDeposit,
  getScheduleParamsValidity,
  isValidScheduleDeposit,
  isValidScheduleGasLimit,
  isValidScheduleGasPrice,
  isSchedulingEnabled
};

export * from './current/windowSize';
export * from './current/windowStart';
export * from './current/timeBounty';
export * from './current/scheduleTimestamp';
export * from './current/scheduleType';
export * from './current/scheduleTimezone';
export * from './current/schedulingToggle';
