import { ScheduleFieldAction, TypeKeys as TK } from 'actions/schedule';
import { Reducer } from 'redux';
import { State } from './typings';
import { gasPriceToBase, fromWei } from 'libs/units';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import moment from 'moment-timezone';
import { minFromNow } from 'selectors/schedule/helpers';

const INITIAL_STATE: State = {
  schedulingToggle: { value: false },
  windowSize: { raw: '', value: null },
  windowStart: { raw: '', value: null },
  scheduleTimestamp: {
    raw: moment(minFromNow(60)).format(EAC_SCHEDULING_CONFIG.SCHEDULE_TIMESTAMP_FORMAT),
    value: minFromNow(60)
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

const updateScheduleField = (key: keyof State): Reducer<State> => (
  state: State,
  action: ScheduleFieldAction
) => ({
  ...state,
  [key]: { ...state[key], ...action.payload }
});

export const schedule = (state: State = INITIAL_STATE, action: ScheduleFieldAction) => {
  switch (action.type) {
    case TK.TIME_BOUNTY_FIELD_SET:
      return updateScheduleField('timeBounty')(state, action);
    case TK.WINDOW_SIZE_FIELD_SET:
      return updateScheduleField('windowSize')(state, action);
    case TK.WINDOW_START_FIELD_SET:
      return updateScheduleField('windowStart')(state, action);
    case TK.SCHEDULE_TIMESTAMP_FIELD_SET:
      return updateScheduleField('scheduleTimestamp')(state, action);
    case TK.SCHEDULE_TIMEZONE_SET:
      return updateScheduleField('scheduleTimezone')(state, action);
    case TK.SCHEDULE_TYPE_SET:
      return updateScheduleField('scheduleType')(state, action);
    case TK.SCHEDULING_TOGGLE_SET:
      return updateScheduleField('schedulingToggle')(state, action);
    case TK.SCHEDULE_GAS_LIMIT_FIELD_SET:
      return updateScheduleField('scheduleGasLimit')(state, action);
    case TK.SCHEDULE_GAS_PRICE_FIELD_SET:
      return updateScheduleField('scheduleGasPrice')(state, action);
    case TK.SCHEDULE_DEPOSIT_FIELD_SET:
      return updateScheduleField('scheduleDeposit')(state, action);
    case TK.SCHEDULE_PARAMS_VALIDITY_SET:
      return updateScheduleField('scheduleParamsValidity')(state, action);
    default:
      return state;
  }
};

export { State };

export default schedule;
