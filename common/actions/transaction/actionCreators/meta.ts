import {
  TypeKeys,
  SetUnitMetaAction,
  SetDecimalMetaAction,
  SetTokenValueMetaAction,
  setDataField,
  setValueField,
  SetTokenToMetaAction,
  setToField
} from 'actions/transaction';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'reducers';
import { toTokenBase, fromTokenBase, Address } from 'libs/units';
import { bufferToHex } from 'ethereumjs-util';
import { encodeTransfer } from 'libs/transaction/utils/token';
import {
  isEtherUnit,
  validNumber
} from 'actions/transaction/actionCreators/helpers';
import { getTokens } from 'selectors/wallet';
import { swapEtherToToken, swapTokenToEther } from './swap';
export {
  TSetDecimalMeta,
  TSetUnitMeta,
  TSetTokenBalance,
  TSetTokenTo,
  setUnitMeta,
  setDecimalMeta,
  setTokenBalance,
  createTokenBalanceAction,
  setTokenTo,
  createTokenToAction
};

type TSetTokenBalance = typeof setTokenBalance;
type TSetUnitMeta = typeof setUnitMeta;
type TSetDecimalMeta = typeof setDecimalMeta;
type TSetTokenTo = typeof setTokenTo;

const createTokenToAction = (
  payload: SetTokenToMetaAction['payload']
): SetTokenToMetaAction => ({ type: TypeKeys.TOKEN_TO_META_SET, payload });

const setTokenTo = (
  payload: SetTokenToMetaAction['payload']
): ThunkAction<any, AppState, null> => (dispatch, getState) => {
  const state = getState();
  const { transaction } = state;
  const { meta: { tokenValue } } = transaction;

  if (payload.value && tokenValue.value) {
    // encode token data and dispatch it
    const data = encodeTransfer(payload.value, tokenValue.value);
    dispatch(setDataField({ raw: bufferToHex(data), value: data }));
  }

  // and set the meta 'to' field to what the user wants to send tokens to
  dispatch(createTokenToAction(payload));
};

const createTokenBalanceAction = (
  payload: SetTokenValueMetaAction['payload']
): SetTokenValueMetaAction => ({
  type: TypeKeys.TOKEN_VALUE_META_SET,
  payload
});

const setTokenBalance = (
  payload: SetTokenValueMetaAction['payload']
): ThunkAction<any, AppState, null> => (dispatch, getState) => {
  const { transaction: { meta: { tokenTo } } } = getState();

  if (tokenTo.value && payload.value) {
    // we'll need to update the data field for the new balance
    const data = encodeTransfer(tokenTo.value, payload.value);
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

/**
 * @description When setting the unit, if its a token then handle the contract data, if it changes to eth
 * then clear the data field.
 * @param payload
 */
const setUnitMeta = (
  payload: SetUnitMetaAction['payload']
): ThunkAction<any, AppState, null> => (dispatch, getState) => {
  const state = getState();
  const tokens = getTokens(state);

  const { transaction } = state;
  const {
    meta: { tokenValue, decimal, unit, tokenTo },
    fields: { value, to }
  } = transaction;
  dispatch(createUnitAction(payload));

  if (!(unit === 'ether' && payload === 'ether')) {
    if (isEtherUnit(payload)) {
      //set the 'to' field from what the token 'to' field was
      dispatch(setToField(tokenTo));

      // if switching to ether, clear token data and value
      dispatch(swapTokenToEther());

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
      // then set the actual field to the token contract address
      const currentToken = tokens.find(t => t.symbol === payload);
      dispatch(
        setToField({
          raw: '',
          value: currentToken ? Address(currentToken.address) : null
        })
      );
      // if we're switching from ether to a token, we also need to swap some of the fields into meta fields
      if (unit === 'ether') {
        //clear ether value
        dispatch(swapEtherToToken());
        // move the ether meta value to token
        // we sub in the raw value for the real value again incase it a valid balance
        // for ether -> token as long as it is a valid number
        const newValue = validNumber(+value.raw)
          ? {
              ...value,
              value: toTokenBase(value.raw, decimal)
            }
          : value;
        // set the balance and encode it
        dispatch(setTokenBalance(newValue));

        // set the 'to' field and encode it
        dispatch(setTokenTo(to));
      }
    }
  }
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
      dispatch(swapTokenToEther());
    } else {
      dispatch(swapEtherToToken());
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
