import { Reducer } from 'redux';
import moment from 'moment-timezone';

import { gasPriceToBase, fromWei } from 'libs/units';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import * as scheduleTypes from './types';
import * as scheduleHelpers from './helpers';

const INITIAL_STATE: scheduleTypes.ScheduleState = {
  schedulingToggle: { value: false },
  windowSize: { raw: '', value: null },
  windowStart: { raw: '', value: null },
  scheduleTimestamp: {
    raw: moment(scheduleHelpers.minFromNow(60)).format(
      EAC_SCHEDULING_CONFIG.SCHEDULE_TIMESTAMP_FORMAT
    ),
    value: scheduleHelpers.minFromNow(60)
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

const updateScheduleField = (
  key: keyof scheduleTypes.ScheduleState
): Reducer<scheduleTypes.ScheduleState> => (
  state: scheduleTypes.ScheduleState,
  action: scheduleTypes.ScheduleFieldAction
) => ({
  ...state,
  [key]: { ...state[key], ...action.payload }
});

export function scheduleReducer(
  state: scheduleTypes.ScheduleState = INITIAL_STATE,
  action: scheduleTypes.ScheduleFieldAction
) {
  switch (action.type) {
    case scheduleTypes.ScheduleActions.TIME_BOUNTY_FIELD_SET:
      return updateScheduleField('timeBounty')(state, action);
    case scheduleTypes.ScheduleActions.WINDOW_SIZE_FIELD_SET:
      return updateScheduleField('windowSize')(state, action);
    case scheduleTypes.ScheduleActions.WINDOW_START_FIELD_SET:
      return updateScheduleField('windowStart')(state, action);
    case scheduleTypes.ScheduleActions.TIMESTAMP_FIELD_SET:
      return updateScheduleField('scheduleTimestamp')(state, action);
    case scheduleTypes.ScheduleActions.TIMEZONE_SET:
      return updateScheduleField('scheduleTimezone')(state, action);
    case scheduleTypes.ScheduleActions.TYPE_SET:
      return updateScheduleField('scheduleType')(state, action);
    case scheduleTypes.ScheduleActions.TOGGLE_SET:
      return updateScheduleField('schedulingToggle')(state, action);
    case scheduleTypes.ScheduleActions.GAS_LIMIT_FIELD_SET:
      return updateScheduleField('scheduleGasLimit')(state, action);
    case scheduleTypes.ScheduleActions.GAS_PRICE_FIELD_SET:
      return updateScheduleField('scheduleGasPrice')(state, action);
    case scheduleTypes.ScheduleActions.DEPOSIT_FIELD_SET:
      return updateScheduleField('scheduleDeposit')(state, action);
    case scheduleTypes.ScheduleActions.PARAMS_VALIDITY_SET:
      return updateScheduleField('scheduleParamsValidity')(state, action);
    default:
      return state;
  }
}
