import { Reducer } from 'redux';
import moment from 'moment-timezone';

import { gasPriceToBase, fromWei } from 'libs/units';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import * as types from './types';
import * as helpers from './helpers';

const INITIAL_STATE: types.ScheduleState = {
  schedulingToggle: { value: false },
  windowSize: { raw: '', value: null },
  windowStart: { raw: '', value: null },
  scheduleTimestamp: {
    raw: moment(helpers.minFromNow(60)).format(EAC_SCHEDULING_CONFIG.SCHEDULE_TIMESTAMP_FORMAT),
    value: helpers.minFromNow(60)
  },
  scheduleTimezone: { raw: moment.tz.guess(), value: moment.tz.guess() },
  timeBounty: {
    raw: fromWei(EAC_SCHEDULING_CONFIG.TIME_BOUNTY_DEFAULT, 'ether'),
    value: EAC_SCHEDULING_CONFIG.TIME_BOUNTY_DEFAULT
  },
  scheduleType: {
    raw: EAC_SCHEDULING_CONFIG.DEFAULT_SCHEDULING_METHOD,
    value: EAC_SCHEDULING_CONFIG.DEFAULT_SCHEDULING_METHOD
  },
  scheduleGasLimit: {
    raw: EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK.toString(),
    value: EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK
  },
  scheduleGasPrice: {
    raw: EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_PRICE_FALLBACK.toString(),
    value: gasPriceToBase(EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_PRICE_FALLBACK)
  },
  scheduleDeposit: { raw: '', value: null },
  scheduleParamsValidity: { value: true }
};

const updateScheduleField = (key: keyof types.ScheduleState): Reducer<types.ScheduleState> => (
  state: types.ScheduleState,
  action: types.ScheduleFieldAction
) => ({
  ...state,
  [key]: { ...state[key], ...action.payload }
});

export function scheduleReducer(
  state: types.ScheduleState = INITIAL_STATE,
  action: types.ScheduleFieldAction
) {
  switch (action.type) {
    case types.ScheduleActions.TIME_BOUNTY_FIELD_SET:
      return updateScheduleField('timeBounty')(state, action);
    case types.ScheduleActions.WINDOW_SIZE_FIELD_SET:
      return updateScheduleField('windowSize')(state, action);
    case types.ScheduleActions.WINDOW_START_FIELD_SET:
      return updateScheduleField('windowStart')(state, action);
    case types.ScheduleActions.TIMESTAMP_FIELD_SET:
      return updateScheduleField('scheduleTimestamp')(state, action);
    case types.ScheduleActions.TIMEZONE_SET:
      return updateScheduleField('scheduleTimezone')(state, action);
    case types.ScheduleActions.TYPE_SET:
      return updateScheduleField('scheduleType')(state, action);
    case types.ScheduleActions.TOGGLE_SET:
      return updateScheduleField('schedulingToggle')(state, action);
    case types.ScheduleActions.GAS_LIMIT_FIELD_SET:
      return updateScheduleField('scheduleGasLimit')(state, action);
    case types.ScheduleActions.GAS_PRICE_FIELD_SET:
      return updateScheduleField('scheduleGasPrice')(state, action);
    case types.ScheduleActions.DEPOSIT_FIELD_SET:
      return updateScheduleField('scheduleDeposit')(state, action);
    case types.ScheduleActions.PARAMS_VALIDITY_SET:
      return updateScheduleField('scheduleParamsValidity')(state, action);
    default:
      return state;
  }
}
