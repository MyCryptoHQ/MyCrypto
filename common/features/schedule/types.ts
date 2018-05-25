import { Wei } from 'libs/units';

export interface ScheduleState {
  schedulingToggle: SetSchedulingToggleAction['payload'];
  timeBounty: SetTimeBountyFieldAction['payload'];
  windowSize: SetWindowSizeFieldAction['payload'];
  windowStart: SetWindowStartFieldAction['payload'];
  scheduleTimestamp: SetScheduleTimestampFieldAction['payload'];
  scheduleTimezone: SetScheduleTimezoneAction['payload'];
  scheduleType: SetScheduleTypeAction['payload'];
  scheduleGasLimit: SetScheduleGasLimitFieldAction['payload'];
  scheduleGasPrice: SetScheduleGasPriceFieldAction['payload'];
  scheduleDeposit: SetScheduleDepositFieldAction['payload'];
  scheduleParamsValidity: SetScheduleParamsValidityAction['payload'];
}

export enum SCHEDULE {
  CURRENT_TIME_BOUNTY_SET = 'CURRENT_TIME_BOUNTY_SET',
  CURRENT_WINDOW_SIZE_SET = 'CURRENT_WINDOW_SIZE_SET',
  CURRENT_WINDOW_START_SET = 'CURRENT_WINDOW_START_SET',
  CURRENT_SCHEDULE_TIMESTAMP_SET = 'CURRENT_SCHEDULE_TIMESTAMP_SET',
  CURRENT_SCHEDULE_TIMEZONE_SET = 'CURRENT_SCHEDULE_TIMEZONE_SET',
  CURRENT_SCHEDULE_TYPE = 'CURRENT_SCHEDULE_TYPE',
  CURRENT_SCHEDULING_TOGGLE = 'CURRENT_SCHEDULING_TOGGLE',
  TIME_BOUNTY_FIELD_SET = 'TIME_BOUNTY_FIELD_SET',
  WINDOW_SIZE_FIELD_SET = 'WINDOW_SIZE_FIELD_SET',
  WINDOW_START_FIELD_SET = 'WINDOW_START_FIELD_SET',
  SCHEDULE_GAS_PRICE_FIELD_SET = 'SCHEDULE_GAS_PRICE_SET',
  SCHEDULE_GAS_LIMIT_FIELD_SET = 'SCHEDULE_GAS_LIMIT_SET',
  SCHEDULE_TIMESTAMP_FIELD_SET = 'SCHEDULE_TIMESTAMP_FIELD_SET',
  SCHEDULE_TIMEZONE_SET = 'SCHEDULE_TIMEZONE_SET',
  SCHEDULE_TYPE_SET = 'SCHEDULE_TYPE_SET',
  SCHEDULING_TOGGLE_SET = 'SCHEDULING_TOGGLE_SET',
  SCHEDULE_DEPOSIT_FIELD_SET = 'SCHEDULE_DEPOSIT_FIELD_SET',
  SCHEDULE_PARAMS_VALIDITY_SET = 'SCHEDULE_PARAMS_VALIDITY_SET'
}

//#region Fields
export interface SetTimeBountyFieldAction {
  type: SCHEDULE.TIME_BOUNTY_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetWindowSizeFieldAction {
  type: SCHEDULE.WINDOW_SIZE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetWindowStartFieldAction {
  type: SCHEDULE.WINDOW_START_FIELD_SET;
  payload: {
    raw: string;
    value: number | null;
  };
}

export interface SetScheduleTimestampFieldAction {
  type: SCHEDULE.SCHEDULE_TIMESTAMP_FIELD_SET;
  payload: {
    raw: string;
    value: Date;
  };
}

export interface SetScheduleTypeAction {
  type: SCHEDULE.SCHEDULE_TYPE_SET;
  payload: {
    raw: string;
    value: string | null;
  };
}

export interface SetSchedulingToggleAction {
  type: SCHEDULE.SCHEDULING_TOGGLE_SET;
  payload: {
    value: boolean;
  };
}

export interface SetScheduleTimezoneAction {
  type: SCHEDULE.SCHEDULE_TIMEZONE_SET;
  payload: {
    raw: string;
    value: string;
  };
}

export interface SetScheduleGasPriceFieldAction {
  type: SCHEDULE.SCHEDULE_GAS_PRICE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetScheduleGasLimitFieldAction {
  type: SCHEDULE.SCHEDULE_GAS_LIMIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetScheduleDepositFieldAction {
  type: SCHEDULE.SCHEDULE_DEPOSIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetScheduleParamsValidityAction {
  type: SCHEDULE.SCHEDULE_PARAMS_VALIDITY_SET;
  payload: {
    value: boolean;
  };
}

export type ScheduleFieldAction =
  | SetTimeBountyFieldAction
  | SetWindowSizeFieldAction
  | SetWindowStartFieldAction
  | SetScheduleTimestampFieldAction
  | SetScheduleTypeAction
  | SetSchedulingToggleAction
  | SetScheduleGasPriceFieldAction
  | SetScheduleGasLimitFieldAction
  | SetScheduleDepositFieldAction
  | SetScheduleTimezoneAction
  | SetScheduleParamsValidityAction;
//#endregion Fields

//#region Schedule Timestamp
export interface SetCurrentScheduleTimestampAction {
  type: SCHEDULE.CURRENT_SCHEDULE_TIMESTAMP_SET;
  payload: string;
}

export type ScheduleTimestampCurrentAction = SetCurrentScheduleTimestampAction;

export interface SetCurrentScheduleTimezoneAction {
  type: SCHEDULE.CURRENT_SCHEDULE_TIMEZONE_SET;
  payload: string;
}
//#endregion Schedule Timestamp

//#region Schedule Type
export interface SetCurrentScheduleTypeAction {
  type: SCHEDULE.CURRENT_SCHEDULE_TYPE;
  payload: string;
}

export type ScheduleTypeCurrentAction = SetCurrentScheduleTypeAction;
//#endregion Schedule Type

//#region Schedule Toggle
export interface SetCurrentSchedulingToggleAction {
  type: SCHEDULE.CURRENT_SCHEDULING_TOGGLE;
  payload: string;
}

export type SchedulingToggleCurrentAction = SetCurrentSchedulingToggleAction;
//#endregion Schedule Toggle

//#region Time Bounty
export interface SetCurrentTimeBountyAction {
  type: SCHEDULE.CURRENT_TIME_BOUNTY_SET;
  payload: string;
}

export type TimeBountyCurrentAction = SetCurrentTimeBountyAction;
//#endregion Time Bounty

//#region Window Size
export interface SetCurrentWindowSizeAction {
  type: SCHEDULE.CURRENT_WINDOW_SIZE_SET;
  payload: string;
}

export type WindowSizeCurrentAction = SetCurrentWindowSizeAction;
//#endregion Window Size

//#region Window Size
export interface SetCurrentWindowStartAction {
  type: SCHEDULE.CURRENT_WINDOW_START_SET;
  payload: string;
}

export type WindowStartCurrentAction = SetCurrentWindowStartAction;
//#endregion Window Size

export type ScheduleAction = ScheduleFieldAction;
