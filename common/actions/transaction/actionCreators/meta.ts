import {
  TypeKeys,
  SetUnitMetaAction,
  SetTokenValueMetaAction,
  SetTokenToMetaAction
} from 'actions/transaction';

type TSetTokenBalance = typeof setTokenValue;
type TSetUnitMeta = typeof setUnitMeta;
type TSetTokenTo = typeof setTokenTo;

const setTokenTo = (payload: SetTokenToMetaAction['payload']): SetTokenToMetaAction => ({
  type: TypeKeys.TOKEN_TO_META_SET,
  payload
});

const setTokenValue = (payload: SetTokenValueMetaAction['payload']): SetTokenValueMetaAction => ({
  type: TypeKeys.TOKEN_VALUE_META_SET,
  payload
});

const setUnitMeta = (payload: SetUnitMetaAction['payload']): SetUnitMetaAction => ({
  type: TypeKeys.UNIT_META_SET,
  payload
});

export { TSetUnitMeta, TSetTokenBalance, TSetTokenTo, setUnitMeta, setTokenValue, setTokenTo };
