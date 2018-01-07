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

type InputFieldAction = InputNonceAction | InputGasLimitAction | InputDataAction;

type FieldAction =
  | SetGasLimitFieldAction
  | SetDataFieldAction
  | SetToFieldAction
  | SetNonceFieldAction
  | SetValueFieldAction
  | SetGasPriceFieldAction;

export {
  InputGasLimitAction,
  InputGasPriceAction,
  InputDataAction,
  InputNonceAction,
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  FieldAction,
  InputFieldAction,
  SetGasPriceFieldAction
};
