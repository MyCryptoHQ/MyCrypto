import { TypeKeys } from 'actions/transaction/constants';
import { Address, TokenValue } from 'libs/units';
/*Meta Actions*/

interface SetTokenToMetaAction {
  type: TypeKeys.TOKEN_TO_META_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

interface SetUnitMetaAction {
  type: TypeKeys.UNIT_META_SET;
  payload: string;
}

interface SetTokenValueMetaAction {
  type: TypeKeys.TOKEN_VALUE_META_SET;
  payload: {
    raw: string;
    value: TokenValue | null;
  };
}

type MetaAction = SetUnitMetaAction | SetTokenValueMetaAction | SetTokenToMetaAction;

export { MetaAction, SetUnitMetaAction, SetTokenToMetaAction, SetTokenValueMetaAction };
