import { Wei } from 'libs/units';

export enum TypeKeys {
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
  type: TypeKeys.TIME_BOUNTY_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetWindowSizeFieldAction {
  type: TypeKeys.WINDOW_SIZE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetWindowStartFieldAction {
  type: TypeKeys.WINDOW_START_FIELD_SET;
  payload: {
    raw: string;
    value: number | null;
  };
}

export interface SetScheduleTimestampFieldAction {
  type: TypeKeys.SCHEDULE_TIMESTAMP_FIELD_SET;
  payload: {
    raw: string;
    value: Date;
  };
}

export interface SetScheduleTypeAction {
  type: TypeKeys.SCHEDULE_TYPE_SET;
  payload: {
    raw: string;
    value: string | null;
  };
}

export interface SetSchedulingToggleAction {
  type: TypeKeys.SCHEDULING_TOGGLE_SET;
  payload: {
    value: boolean;
  };
}

export interface SetScheduleTimezoneAction {
  type: TypeKeys.SCHEDULE_TIMEZONE_SET;
  payload: {
    raw: string;
    value: string;
  };
}

export interface SetScheduleGasPriceFieldAction {
  type: TypeKeys.SCHEDULE_GAS_PRICE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetScheduleGasLimitFieldAction {
  type: TypeKeys.SCHEDULE_GAS_LIMIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetScheduleDepositFieldAction {
  type: TypeKeys.SCHEDULE_DEPOSIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetScheduleParamsValidityAction {
  type: TypeKeys.SCHEDULE_PARAMS_VALIDITY_SET;
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
  type: TypeKeys.CURRENT_SCHEDULE_TIMESTAMP_SET;
  payload: string;
}

export type ScheduleTimestampCurrentAction = SetCurrentScheduleTimestampAction;

export interface SetCurrentScheduleTimezoneAction {
  type: TypeKeys.CURRENT_SCHEDULE_TIMEZONE_SET;
  payload: string;
}
//#endregion Schedule Timestamp

//#region Schedule Type
export interface SetCurrentScheduleTypeAction {
  type: TypeKeys.CURRENT_SCHEDULE_TYPE;
  payload: string;
}

export type ScheduleTypeCurrentAction = SetCurrentScheduleTypeAction;
//#endregion Schedule Type

//#region Schedule Toggle
export interface SetCurrentSchedulingToggleAction {
  type: TypeKeys.CURRENT_SCHEDULING_TOGGLE;
  payload: string;
}

export type SchedulingToggleCurrentAction = SetCurrentSchedulingToggleAction;
//#endregion Schedule Toggle

//#region Time Bounty
export interface SetCurrentTimeBountyAction {
  type: TypeKeys.CURRENT_TIME_BOUNTY_SET;
  payload: string;
}

export type TimeBountyCurrentAction = SetCurrentTimeBountyAction;
//#endregion Time Bounty

//#region Window Size
export interface SetCurrentWindowSizeAction {
  type: TypeKeys.CURRENT_WINDOW_SIZE_SET;
  payload: string;
}

export type WindowSizeCurrentAction = SetCurrentWindowSizeAction;
//#endregion Window Size

//#region Window Size
export interface SetCurrentWindowStartAction {
  type: TypeKeys.CURRENT_WINDOW_START_SET;
  payload: string;
}

export type WindowStartCurrentAction = SetCurrentWindowStartAction;
//#endregion Window Size

export type ScheduleAction = ScheduleFieldAction;
