import {
  SetWindowSizeFieldAction,
  SetWindowStartFieldAction,
  SetScheduleTimestampFieldAction,
  SetScheduleTypeAction,
  SetSchedulingToggleAction,
  SetScheduleGasPriceFieldAction,
  SetScheduleGasLimitFieldAction,
  SetScheduleDepositFieldAction,
  SetScheduleTimezoneAction,
  SetScheduleParamsValidityAction,
  SetTimeBountyFieldAction
} from 'actions/schedule';

export interface State {
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
