import { TypeKeys } from 'actions/transaction/constants';
import { Wei, Data, Address, Nonce } from 'libs/units';

/* User Input */
interface InputGasLimitAction {
  type: TypeKeys.GAS_LIMIT_INPUT;
  payload: string;
}
interface InputGasPriceAction {
  type: TypeKeys.GAS_PRICE_INPUT;
  payload: string;
}
interface InputGasPriceIntentAction {
  type: TypeKeys.GAS_PRICE_INPUT_INTENT;
  payload: string;
}
interface InputTimeBountyAction {
  type: TypeKeys.TIME_BOUNTY_INPUT;
  payload: string;
}
interface InputTimeBountyIntentAction {
  type: TypeKeys.TIME_BOUNTY_INPUT_INTENT;
  payload: string;
}
interface InputDataAction {
  type: TypeKeys.DATA_FIELD_INPUT;
  payload: string;
}
interface InputNonceAction {
  type: TypeKeys.NONCE_INPUT;
  payload: string;
}

/*Field Actions -- Reducer input*/

// We can compute field validity by checking if the value is null

interface SetGasLimitFieldAction {
  type: TypeKeys.GAS_LIMIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface SetGasPriceFieldAction {
  type: TypeKeys.GAS_PRICE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface SetTimeBountyFieldAction {
  type: TypeKeys.TIME_BOUNTY_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface SetDataFieldAction {
  type: TypeKeys.DATA_FIELD_SET;
  payload: {
    raw: string;
    value: Data | null;
  };
}

interface SetToFieldAction {
  type: TypeKeys.TO_FIELD_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

interface SetNonceFieldAction {
  type: TypeKeys.NONCE_FIELD_SET;
  payload: {
    raw: string;
    value: Nonce | null;
  };
}

interface SetValueFieldAction {
  type: TypeKeys.VALUE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface SetWindowSizeFieldAction {
  type: TypeKeys.WINDOW_SIZE_FIELD_SET;
  payload: {
    raw: string;
    value: number | null;
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
    value: Date | null;
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
    raw: string;
    value: boolean;
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

type InputFieldAction = InputNonceAction | InputGasLimitAction | InputDataAction;

type FieldAction =
  | SetGasLimitFieldAction
  | SetDataFieldAction
  | SetToFieldAction
  | SetNonceFieldAction
  | SetValueFieldAction
  | SetGasPriceFieldAction
  | SetTimeBountyFieldAction
  | SetWindowSizeFieldAction
  | SetWindowStartFieldAction
  | SetScheduleTimestampFieldAction
  | SetScheduleTypeAction
  | SetSchedulingToggleAction
  | SetScheduleGasPriceFieldAction
  | SetScheduleGasLimitFieldAction;

export {
  InputGasLimitAction,
  InputGasPriceAction,
  InputGasPriceIntentAction,
  InputTimeBountyAction,
  InputTimeBountyIntentAction,
  InputDataAction,
  InputNonceAction,
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  FieldAction,
  InputFieldAction,
  SetGasPriceFieldAction,
  SetTimeBountyFieldAction,
  SetWindowSizeFieldAction,
  SetWindowStartFieldAction,
  SetScheduleTimestampFieldAction,
  SetScheduleTypeAction,
  SetSchedulingToggleAction,
  SetScheduleGasPriceFieldAction,
  SetScheduleGasLimitFieldAction
};
