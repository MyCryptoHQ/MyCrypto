import * as scheduleTypes from './types';

//#region Fields
export type TSetTimeBountyField = typeof setTimeBountyField;
export const setTimeBountyField = (
  payload: scheduleTypes.SetTimeBountyFieldAction['payload']
): scheduleTypes.SetTimeBountyFieldAction => ({
  type: scheduleTypes.ScheduleActions.TIME_BOUNTY_FIELD_SET,
  payload
});

export type TSetWindowSizeField = typeof setWindowSizeField;
export const setWindowSizeField = (
  payload: scheduleTypes.SetWindowSizeFieldAction['payload']
): scheduleTypes.SetWindowSizeFieldAction => ({
  type: scheduleTypes.ScheduleActions.WINDOW_SIZE_FIELD_SET,
  payload
});

export type TSetWindowStartField = typeof setWindowStartField;
export const setWindowStartField = (
  payload: scheduleTypes.SetWindowStartFieldAction['payload']
): scheduleTypes.SetWindowStartFieldAction => ({
  type: scheduleTypes.ScheduleActions.WINDOW_START_FIELD_SET,
  payload
});

export type TSetScheduleTimestampField = typeof setScheduleTimestampField;
export const setScheduleTimestampField = (
  payload: scheduleTypes.SetScheduleTimestampFieldAction['payload']
): scheduleTypes.SetScheduleTimestampFieldAction => ({
  type: scheduleTypes.ScheduleActions.TIMESTAMP_FIELD_SET,
  payload
});

export type TSetScheduleType = typeof setScheduleType;
export const setScheduleType = (
  payload: scheduleTypes.SetScheduleTypeAction['payload']
): scheduleTypes.SetScheduleTypeAction => ({
  type: scheduleTypes.ScheduleActions.TYPE_SET,
  payload
});

export type TSetSchedulingToggle = typeof setSchedulingToggle;
export const setSchedulingToggle = (
  payload: scheduleTypes.SetSchedulingToggleAction['payload']
): scheduleTypes.SetSchedulingToggleAction => ({
  type: scheduleTypes.ScheduleActions.TOGGLE_SET,
  payload
});

export type TSetScheduleTimezone = typeof setScheduleTimezone;
export const setScheduleTimezone = (
  payload: scheduleTypes.SetScheduleTimezoneAction['payload']
): scheduleTypes.SetScheduleTimezoneAction => ({
  type: scheduleTypes.ScheduleActions.TIMEZONE_SET,
  payload
});

export type TSetScheduleGasPriceField = typeof setScheduleGasPriceField;
export const setScheduleGasPriceField = (
  payload: scheduleTypes.SetScheduleGasPriceFieldAction['payload']
) => ({
  type: scheduleTypes.ScheduleActions.GAS_PRICE_FIELD_SET,
  payload
});

export type TSetScheduleGasLimitField = typeof setScheduleGasLimitField;
export const setScheduleGasLimitField = (
  payload: scheduleTypes.SetScheduleGasLimitFieldAction['payload']
) => ({
  type: scheduleTypes.ScheduleActions.GAS_LIMIT_FIELD_SET,
  payload
});

export type TSetScheduleDepositField = typeof setScheduleDepositField;
export const setScheduleDepositField = (
  payload: scheduleTypes.SetScheduleDepositFieldAction['payload']
) => ({
  type: scheduleTypes.ScheduleActions.DEPOSIT_FIELD_SET,
  payload
});

export type TSetScheduleParamsValidity = typeof setScheduleParamsValidity;
export const setScheduleParamsValidity = (
  payload: scheduleTypes.SetScheduleParamsValidityAction['payload']
) => ({
  type: scheduleTypes.ScheduleActions.PARAMS_VALIDITY_SET,
  payload
});
//#endregion Fields

//#region Schedule Timestamp
export type TSetCurrentScheduleTimestamp = typeof setCurrentScheduleTimestamp;
export const setCurrentScheduleTimestamp = (
  payload: scheduleTypes.SetCurrentScheduleTimestampAction['payload']
): scheduleTypes.SetCurrentScheduleTimestampAction => ({
  type: scheduleTypes.ScheduleActions.CURRENT_SCHEDULE_TIMESTAMP_SET,
  payload
});

export type TSetCurrentScheduleTimezone = typeof setCurrentScheduleTimezone;
export const setCurrentScheduleTimezone = (
  payload: scheduleTypes.SetCurrentScheduleTimezoneAction['payload']
): scheduleTypes.SetCurrentScheduleTimezoneAction => ({
  type: scheduleTypes.ScheduleActions.CURRENT_SCHEDULE_TIMEZONE_SET,
  payload
});
//#endregion Schedule Timestamp

//#region Schedule Type
export type TSetCurrentScheduleType = typeof setCurrentScheduleType;
export const setCurrentScheduleType = (
  payload: scheduleTypes.SetCurrentScheduleTypeAction['payload']
): scheduleTypes.SetCurrentScheduleTypeAction => ({
  type: scheduleTypes.ScheduleActions.CURRENT_SCHEDULE_TYPE,
  payload
});
//#endregion Schedule Type

//#region Scheduling Toggle
export type TSetCurrentSchedulingToggle = typeof setCurrentSchedulingToggle;
export const setCurrentSchedulingToggle = (
  payload: scheduleTypes.SetCurrentSchedulingToggleAction['payload']
): scheduleTypes.SetCurrentSchedulingToggleAction => ({
  type: scheduleTypes.ScheduleActions.CURRENT_SCHEDULING_TOGGLE,
  payload
});
//#endregion Scheduling Toggle

//#region Time Bounty
export type TSetCurrentTimeBounty = typeof setCurrentTimeBounty;
export const setCurrentTimeBounty = (
  payload: scheduleTypes.SetCurrentTimeBountyAction['payload']
): scheduleTypes.SetCurrentTimeBountyAction => ({
  type: scheduleTypes.ScheduleActions.CURRENT_TIME_BOUNTY_SET,
  payload
});
//#endregion Time Bounty

//#region Window Size
export type TSetCurrentWindowSize = typeof setCurrentWindowSize;
export const setCurrentWindowSize = (
  payload: scheduleTypes.SetCurrentWindowSizeAction['payload']
): scheduleTypes.SetCurrentWindowSizeAction => ({
  type: scheduleTypes.ScheduleActions.CURRENT_WINDOW_SIZE_SET,
  payload
});
//#endregion Window Size

//#region Window Size
export type TSetCurrentWindowStart = typeof setCurrentWindowStart;
export const setCurrentWindowStart = (
  payload: scheduleTypes.SetCurrentWindowStartAction['payload']
): scheduleTypes.SetCurrentWindowStartAction => ({
  type: scheduleTypes.ScheduleActions.CURRENT_WINDOW_START_SET,
  payload
});
//#endregion Window Size
