import { TypeKeys } from 'actions/schedule/constants';
import { Wei } from 'libs/units';

interface SetTimeBountyFieldAction {
  type: TypeKeys.TIME_BOUNTY_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface SetWindowSizeFieldAction {
  type: TypeKeys.WINDOW_SIZE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface SetWindowStartFieldAction {
  type: TypeKeys.WINDOW_START_FIELD_SET;
  payload: {
    raw: string;
    value: number | null;
  };
}

interface SetScheduleTimestampFieldAction {
  type: TypeKeys.SCHEDULE_TIMESTAMP_FIELD_SET;
  payload: {
    raw: string;
    value: Date;
  };
}

interface SetScheduleTypeAction {
  type: TypeKeys.SCHEDULE_TYPE_SET;
  payload: {
    raw: string;
    value: string | null;
  };
}

interface SetSchedulingToggleAction {
  type: TypeKeys.SCHEDULING_TOGGLE_SET;
  payload: {
    value: boolean;
  };
}

interface SetScheduleTimezoneAction {
  type: TypeKeys.SCHEDULE_TIMEZONE_SET;
  payload: {
    raw: string;
    value: string;
  };
}

interface SetScheduleGasPriceFieldAction {
  type: TypeKeys.SCHEDULE_GAS_PRICE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface SetScheduleGasLimitFieldAction {
  type: TypeKeys.SCHEDULE_GAS_LIMIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface SetScheduleDepositFieldAction {
  type: TypeKeys.SCHEDULE_DEPOSIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface SetScheduleParamsValidityAction {
  type: TypeKeys.SCHEDULE_PARAMS_VALIDITY_SET;
  payload: {
    value: boolean;
  };
}

type ScheduleFieldAction =
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

export {
  ScheduleFieldAction,
  SetTimeBountyFieldAction,
  SetWindowSizeFieldAction,
  SetWindowStartFieldAction,
  SetScheduleTimestampFieldAction,
  SetScheduleTypeAction,
  SetSchedulingToggleAction,
  SetScheduleGasPriceFieldAction,
  SetScheduleGasLimitFieldAction,
  SetScheduleDepositFieldAction,
  SetScheduleTimezoneAction,
  SetScheduleParamsValidityAction
};
