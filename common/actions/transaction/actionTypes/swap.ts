import { TypeKeys } from 'actions/transaction/constants';
import {
  SetToFieldAction,
  SetValueFieldAction,
  SetTokenToMetaAction,
  SetTokenValueMetaAction,
  SetDataFieldAction
} from 'actions/transaction';

/* Swapping actions */
interface SwapTokenToEtherAction {
  type: TypeKeys.TOKEN_TO_ETHER_SWAP;
  payload: {
    to: SetToFieldAction['payload'];
    value: SetValueFieldAction['payload'];
    decimal: number;
  };
}
interface SwapEtherToTokenAction {
  type: TypeKeys.ETHER_TO_TOKEN_SWAP;
  payload: {
    to: SetToFieldAction['payload'];
    data: SetDataFieldAction['payload'];
    tokenTo: SetTokenToMetaAction['payload'];
    tokenValue: SetTokenValueMetaAction['payload'];
    decimal: number;
  };
}
interface SwapTokenToTokenAction {
  type: TypeKeys.TOKEN_TO_TOKEN_SWAP;
  payload: {
    to: SetToFieldAction['payload'];
    data: SetDataFieldAction['payload'];
    tokenValue: SetTokenValueMetaAction['payload'];
    decimal: number;
  };
}
type SwapAction = SwapEtherToTokenAction | SwapTokenToEtherAction | SwapTokenToTokenAction;

export { SwapTokenToEtherAction, SwapEtherToTokenAction, SwapAction, SwapTokenToTokenAction };
