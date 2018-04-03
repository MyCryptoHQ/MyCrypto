import {
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  InputGasLimitAction,
  InputGasPriceAction,
  InputGasPriceIntentAction,
  InputDataAction,
  InputNonceAction,
  ResetAction,
  SetGasPriceFieldAction,
  SetTimeBountyFieldAction,
  SetWindowSizeFieldAction,
  SetWindowStartFieldAction,
  SetScheduleTimestampFieldAction,
  SetScheduleTypeAction,
  SetSchedulingToggleAction,
  SetScheduleTimezoneAction,
  SetScheduleGasPriceFieldAction,
  SetScheduleGasLimitFieldAction,
  SetScheduleDepositFieldAction
} from '../actionTypes';
import { TypeKeys } from 'actions/transaction/constants';

type TInputGasLimit = typeof inputGasLimit;
const inputGasLimit = (payload: InputGasLimitAction['payload']) => ({
  type: TypeKeys.GAS_LIMIT_INPUT,
  payload
});

type TInputGasPrice = typeof inputGasPrice;
const inputGasPrice = (payload: InputGasPriceAction['payload']) => ({
  type: TypeKeys.GAS_PRICE_INPUT,
  payload
});

type TInputGasPriceIntent = typeof inputGasPrice;
const inputGasPriceIntent = (payload: InputGasPriceIntentAction['payload']) => ({
  type: TypeKeys.GAS_PRICE_INPUT_INTENT,
  payload
});

type TSetTimeBountyField = typeof setTimeBountyField;
const setTimeBountyField = (
  payload: SetTimeBountyFieldAction['payload']
): SetTimeBountyFieldAction => ({
  type: TypeKeys.TIME_BOUNTY_FIELD_SET,
  payload
});

type TInputNonce = typeof inputNonce;
const inputNonce = (payload: InputNonceAction['payload']) => ({
  type: TypeKeys.NONCE_INPUT,
  payload
});

type TInputData = typeof inputData;
const inputData = (payload: InputDataAction['payload']) => ({
  type: TypeKeys.DATA_FIELD_INPUT,
  payload
});

type TSetGasLimitField = typeof setGasLimitField;
const setGasLimitField = (payload: SetGasLimitFieldAction['payload']): SetGasLimitFieldAction => ({
  type: TypeKeys.GAS_LIMIT_FIELD_SET,
  payload
});

type TSetDataField = typeof setDataField;
const setDataField = (payload: SetDataFieldAction['payload']): SetDataFieldAction => ({
  type: TypeKeys.DATA_FIELD_SET,
  payload
});

type TSetToField = typeof setToField;
const setToField = (payload: SetToFieldAction['payload']): SetToFieldAction => ({
  type: TypeKeys.TO_FIELD_SET,
  payload
});

type TSetNonceField = typeof setNonceField;
const setNonceField = (payload: SetNonceFieldAction['payload']): SetNonceFieldAction => ({
  type: TypeKeys.NONCE_FIELD_SET,
  payload
});

type TSetValueField = typeof setValueField;
const setValueField = (payload: SetValueFieldAction['payload']): SetValueFieldAction => ({
  type: TypeKeys.VALUE_FIELD_SET,
  payload
});

type TSetGasPriceField = typeof setGasPriceField;
const setGasPriceField = (payload: SetGasPriceFieldAction['payload']): SetGasPriceFieldAction => ({
  type: TypeKeys.GAS_PRICE_FIELD_SET,
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

type TReset = typeof reset;
const reset = (payload: ResetAction['payload'] = { include: {}, exclude: {} }): ResetAction => ({
  type: TypeKeys.RESET,
  payload
});

export {
  TInputGasLimit,
  TInputGasPrice,
  TInputGasPriceIntent,
  TInputNonce,
  TInputData,
  TSetGasLimitField,
  TSetDataField,
  TSetToField,
  TSetNonceField,
  TSetValueField,
  TSetGasPriceField,
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
  TReset,
  inputGasLimit,
  inputGasPrice,
  inputGasPriceIntent,
  setTimeBountyField,
  inputNonce,
  inputData,
  setGasLimitField,
  setDataField,
  setToField,
  setNonceField,
  setValueField,
  setGasPriceField,
  setWindowSizeField,
  setWindowStartField,
  setScheduleTimestampField,
  setScheduleType,
  setSchedulingToggle,
  setScheduleTimezone,
  setScheduleGasPriceField,
  setScheduleGasLimitField,
  setScheduleDepositField,
  reset
};
