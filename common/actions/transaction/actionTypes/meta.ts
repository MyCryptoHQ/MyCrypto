import { TypeKeys } from 'actions/transaction/constants';
import { Address, TokenValue } from 'libs/units';
export {
  MetaAction,
  SetUnitMetaAction,
  SetDecimalMetaAction,
  SetTokenToMetaAction,
  SetTokenValueMetaAction
};
/*Meta Actions*/

interface SetTokenToMetaAction {
  type: TypeKeys.TOKEN_TO_META_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

interface SetDecimalMetaAction {
  type: TypeKeys.DECIMAL_META_SET;
  payload: number;
}

interface SetUnitMetaAction {
  type: TypeKeys.UNIT_META_SET;
  payload: string;
}

interface SetTokenValueMetaAction {
  type: TypeKeys.TOKEN_VALUE_META_SET;
  payload: {
    raw?: string;
    value: TokenValue | null;
  };
}

type MetaAction =
  | SetUnitMetaAction
  | SetDecimalMetaAction
  | SetTokenValueMetaAction
  | SetTokenToMetaAction;
