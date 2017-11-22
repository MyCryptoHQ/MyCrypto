import {
  TypeKeys,
  SetUnitMetaAction,
  SetDecimalMetaAction,
  SetTokenValueMetaAction,
  setDataField,
  setValueField
} from 'actions/transaction';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'reducers';
import { toTokenBase, fromTokenBase, TokenValue } from 'libs/units';
import { bufferToHex } from 'ethereumjs-util';
import { encodeTransfer } from 'libs/transaction/utils/token';
import {
  isEtherUnit,
  clearTokenDataAndValue,
  clearEther,
  shouldDecimalUpdate,
  validNumber
} from 'actions/transaction/actionCreators/helpers';
export {
  TSetDecimalMeta,
  TSetUnitMeta,
  TSetTokenBalance,
  setUnitMeta,
  setDecimalMeta,
  setTokenBalance,
  createTokenBalanceAction
};

type TSetTokenBalance = typeof setTokenBalance;
type TSetUnitMeta = typeof setUnitMeta;
type TSetDecimalMeta = typeof setDecimalMeta;

const createTokenBalanceAction = (
  payload: SetTokenValueMetaAction['payload']
): SetTokenValueMetaAction => ({
  type: TypeKeys.TOKEN_VALUE_META_SET,
  payload
});

const setTokenBalance = (
  payload: SetTokenValueMetaAction['payload']
): ThunkAction<any, AppState, null> => (dispatch, getState) => {
  const { transaction: { fields: { to } } } = getState();

  if (to.value && payload.value) {
    // we'll need to update the data field for the new balance
    const data = encodeTransfer(to.value, payload.value);
    dispatch(setDataField({ raw: bufferToHex(data), value: data }));
  }

  return dispatch(createTokenBalanceAction(payload));
};

const createUnitAction = (
  payload: SetUnitMetaAction['payload']
): SetUnitMetaAction => ({
  type: TypeKeys.UNIT_META_SET,
  payload
});

// Only update when switching from or two ether
const shouldSwapValueFields = (unit1: string, unit2: string) =>
  (unit1 === 'ether' && unit2 !== 'ether') ||
  (unit2 === 'ether' && unit1 !== 'ether');
/**
 * @description When setting the unit, if its a token then handle the contract data, if it changes to eth
 * then clear the data field.
 * @param payload
 */
const setUnitMeta = (
  payload: SetUnitMetaAction['payload']
): ThunkAction<any, AppState, null> => (dispatch, getState) => {
  const { transaction } = getState();
  const {
    meta: { tokenValue, unit, decimal },
    fields: { value }
  } = transaction;

  if (shouldSwapValueFields(unit, payload)) {
    if (isEtherUnit(payload)) {
      // if switching to ether, clear token data and value
      clearTokenDataAndValue(dispatch);
      // and move the token meta value to ether value
      // we sub in the raw value for the real value again incase it a valid balance
      // for token -> ether as long as it is a valid number
      const newValue = validNumber(+tokenValue.raw)
        ? {
            ...tokenValue,
            value: toTokenBase(tokenValue.raw, decimal)
          }
        : tokenValue;
      dispatch(setValueField(newValue));
    } else {
      //clear ether value
      clearEther(dispatch);
      // move the ether meta value to token
      // we sub in the raw value for the real value again incase it a valid balance
      // for ether -> token as long as it is a valid number
      const newValue = validNumber(+value.raw)
        ? {
            ...value,
            value: toTokenBase(value.raw, decimal)
          }
        : value;

      dispatch(setTokenBalance(newValue));
    }
  }
  dispatch(createUnitAction(payload));
};

const createDecimalAction = (
  payload: SetDecimalMetaAction['payload']
): SetDecimalMetaAction => ({
  type: TypeKeys.DECIMAL_META_SET,
  payload
});

/**
 *  When decimal is set, check if its different than the currently set decimal,
 *  if so, set the balance to the correct decimal
 * @param payload
 */
const setDecimalMeta = (
  payload: SetDecimalMetaAction['payload']
): ThunkAction<any, AppState, null> => (dispatch, getState) => {
  const { transaction } = getState();
  const {
    meta: { decimal, tokenValue, unit },
    fields: { value: balance }
  } = transaction;

  if (balance.value && tokenValue.value) {
    // if we have a balance of both
    // we have a conflict between ether or token balance
    if (isEtherUnit(unit)) {
      clearTokenDataAndValue(dispatch);
    } else {
      clearEther(dispatch);
    }
  }

  // we change the value parameter to the new base value, but keep the display raw value the same
  if (isEtherUnit(unit)) {
    if (balance.value) {
      const newBalance = toTokenBase(
        fromTokenBase(balance.value, decimal),
        payload
      );
      dispatch(setValueField({ raw: balance.raw, value: newBalance }));
    }
  } else {
    // we sub in the raw value for the real value again incase it a valid balance
    // for ether -> token as long as it is a valid number
    // TODO: move this swap handling to the unit thunk
    const newValue = validNumber(+tokenValue.raw)
      ? toTokenBase(tokenValue.raw, decimal)
      : tokenValue.value;
    if (newValue) {
      const newBalance = toTokenBase(fromTokenBase(newValue, decimal), payload);
      dispatch(setTokenBalance({ raw: tokenValue.raw, value: newBalance }));
    }
  }

  return dispatch(createDecimalAction(payload));
};
