import {
  SetTimeBountyFieldAction,
  SetWindowSizeFieldAction,
  SetWindowStartFieldAction,
  SetScheduleTimestampFieldAction,
  SetScheduleTypeAction,
  SetSchedulingToggleAction,
  SetScheduleTimezoneAction,
  SetScheduleGasPriceFieldAction,
  SetScheduleGasLimitFieldAction,
  SetScheduleDepositFieldAction,
  SetScheduleParamsValidityAction
} from '../actionTypes';
import { TypeKeys } from 'actions/schedule/constants';

type TSetTimeBountyField = typeof setTimeBountyField;
const setTimeBountyField = (
  payload: SetTimeBountyFieldAction['payload']
): SetTimeBountyFieldAction => ({
  type: TypeKeys.TIME_BOUNTY_FIELD_SET,
  payload
});

type TSetWindowSizeField = typeof setWindowSizeField;
const setWindowSizeField = (
  payload: SetWindowSizeFieldAction['payload']
): SetWindowSizeFieldAction => ({
  type: TypeKeys.WINDOW_SIZE_FIELD_SET,
  payload
});

type TSetWindowStartField = typeof setWindowStartField;
const setWindowStartField = (
  payload: SetWindowStartFieldAction['payload']
): SetWindowStartFieldAction => ({
  type: TypeKeys.WINDOW_START_FIELD_SET,
  payload
});

type TSetScheduleTimestampField = typeof setScheduleTimestampField;
const setScheduleTimestampField = (
  payload: SetScheduleTimestampFieldAction['payload']
): SetScheduleTimestampFieldAction => ({
  type: TypeKeys.SCHEDULE_TIMESTAMP_FIELD_SET,
  payload
});

type TSetScheduleType = typeof setScheduleType;
const setScheduleType = (payload: SetScheduleTypeAction['payload']): SetScheduleTypeAction => ({
  type: TypeKeys.SCHEDULE_TYPE_SET,
  payload
});

type TSetSchedulingToggle = typeof setSchedulingToggle;
const setSchedulingToggle = (
  payload: SetSchedulingToggleAction['payload']
): SetSchedulingToggleAction => ({
  type: TypeKeys.SCHEDULING_TOGGLE_SET,
  payload
});

type TSetScheduleTimezone = typeof setScheduleTimezone;
const setScheduleTimezone = (
  payload: SetScheduleTimezoneAction['payload']
): SetScheduleTimezoneAction => ({
  type: TypeKeys.SCHEDULE_TIMEZONE_SET,
  payload
});

type TSetScheduleGasPriceField = typeof setScheduleGasPriceField;
const setScheduleGasPriceField = (payload: SetScheduleGasPriceFieldAction['payload']) => ({
  type: TypeKeys.SCHEDULE_GAS_PRICE_FIELD_SET,
  payload
});

type TSetScheduleGasLimitField = typeof setScheduleGasLimitField;
const setScheduleGasLimitField = (payload: SetScheduleGasLimitFieldAction['payload']) => ({
  type: TypeKeys.SCHEDULE_GAS_LIMIT_FIELD_SET,
  payload
});

type TSetScheduleDepositField = typeof setScheduleDepositField;
const setScheduleDepositField = (payload: SetScheduleDepositFieldAction['payload']) => ({
  type: TypeKeys.SCHEDULE_DEPOSIT_FIELD_SET,
  payload
});

type TSetScheduleParamsValidity = typeof setScheduleParamsValidity;
const setScheduleParamsValidity = (payload: SetScheduleParamsValidityAction['payload']) => ({
  type: TypeKeys.SCHEDULE_PARAMS_VALIDITY_SET,
  payload
});

export {
  TSetWindowSizeField,
  TSetWindowStartField,
  TSetTimeBountyField,
  TSetScheduleTimestampField,
  TSetScheduleType,
  TSetSchedulingToggle,
  TSetScheduleTimezone,
  TSetScheduleGasPriceField,
  TSetScheduleGasLimitField,
  TSetScheduleDepositField,
  TSetScheduleParamsValidity,
  setTimeBountyField,
  setWindowSizeField,
  setWindowStartField,
  setScheduleTimestampField,
  setScheduleType,
  setSchedulingToggle,
  setScheduleTimezone,
  setScheduleGasPriceField,
  setScheduleGasLimitField,
  setScheduleDepositField,
  setScheduleParamsValidity
};
