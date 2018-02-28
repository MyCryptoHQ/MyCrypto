import {
  TypeKeys,
  SetUnitMetaAction,
  SetTokenValueMetaAction,
  SetTokenToMetaAction
} from 'actions/transaction';

export type TSetTokenTo = typeof setTokenTo;
export const setTokenTo = (payload: SetTokenToMetaAction['payload']): SetTokenToMetaAction => ({
  type: TypeKeys.TOKEN_TO_META_SET,
  payload
});

export type TSetTokenValue = typeof setTokenValue;
export const setTokenValue = (
  payload: SetTokenValueMetaAction['payload']
): SetTokenValueMetaAction => ({
  type: TypeKeys.TOKEN_VALUE_META_SET,
  payload
});

export type TSetUnitMeta = typeof setUnitMeta;
export const setUnitMeta = (payload: SetUnitMetaAction['payload']): SetUnitMetaAction => ({
  type: TypeKeys.UNIT_META_SET,
  payload
});
