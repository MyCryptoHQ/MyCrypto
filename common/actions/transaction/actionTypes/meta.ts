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

interface SetAsContractInteractionAction {
  type: TypeKeys.IS_CONTRACT_INTERACTION;
}

interface SetAsViewAndSendAction {
  type: TypeKeys.IS_VIEW_AND_SEND;
}

type TransactionMetaAction = SetUnitMetaAction | SetTokenValueMetaAction | SetTokenToMetaAction;
type TransactionTypeMetaAction = SetAsContractInteractionAction | SetAsViewAndSendAction;

type MetaAction = TransactionMetaAction | TransactionTypeMetaAction;

export {
  TransactionMetaAction,
  TransactionTypeMetaAction,
  MetaAction,
  SetUnitMetaAction,
  SetTokenToMetaAction,
  SetTokenValueMetaAction,
  SetAsContractInteractionAction,
  SetAsViewAndSendAction
};
