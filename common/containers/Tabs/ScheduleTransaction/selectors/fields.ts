import { AppState } from 'reducers';
import { getFields } from 'selectors/transaction';

const getTimeBounty = (state: AppState) => getFields(state).timeBounty;
const getWindowSize = (state: AppState) => getFields(state).windowSize;
const getWindowStart = (state: AppState) => getFields(state).windowStart;
const getScheduleTimestamp = (state: AppState) => getFields(state).scheduleTimestamp;
const getScheduleType = (state: AppState) => getFields(state).scheduleType;
const getScheduleTimezone = (state: AppState) => getFields(state).scheduleTimezone;
const getSchedulingToggle = (state: AppState) => getFields(state).schedulingToggle;
const getScheduleGasLimit = (state: AppState) => getFields(state).scheduleGasLimit;
const getScheduleGasPrice = (state: AppState) => getFields(state).scheduleGasPrice;
const getScheduleDeposit = (state: AppState) => getFields(state).scheduleDeposit;

const schedulingFields = [
  'windowStart',
  'windowSize',
  'scheduleTimestamp',
  'scheduleTimezone',
  'schedulingToggle',
  'scheduleDeposit',
  'scheduleGasLimit',
  'scheduleGasPrice'
];

export {
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
  schedulingFields
};
